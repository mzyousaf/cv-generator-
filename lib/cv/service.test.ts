import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CV_ERROR_CODES } from "@/lib/cv/errors";
import { createEmptyCvContent } from "@/lib/cv/validation";
import { createCvService } from "@/lib/cv/service";
import type { CvRecord, CvRecordWithOwner } from "@/lib/cv/repository";
import type { CurrentUser } from "@/lib/auth/get-current-user";

const USER_A: CurrentUser = {
  id: "aaaaaaaaaaaaaaaaaaaaaaaa",
  email: "a@example.com",
  name: "User A",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

const USER_B: CurrentUser = {
  id: "bbbbbbbbbbbbbbbbbbbbbbbb",
  email: "b@example.com",
  name: "User B",
  createdAt: new Date("2024-01-01T00:00:00.000Z"),
  updatedAt: new Date("2024-01-01T00:00:00.000Z"),
};

const CV_ID = "507f1f77bcf86cd799439011";

function sampleCv(overrides?: Partial<CvRecord>): CvRecord {
  return {
    id: CV_ID,
    title: "My CV",
    template: "default",
    content: createEmptyCvContent(),
    createdAt: "2024-01-02T00:00:00.000Z",
    updatedAt: "2024-01-02T00:00:00.000Z",
    ...overrides,
  };
}

describe("cv service ownership and auth", () => {
  it("1. User A can create a CV", async () => {
    let created = false;
    const service = createCvService({
      getUser: async () => USER_A,
      repository: {
        create: async (input) => {
          created = true;
          assert.equal(input.userId, USER_A.id);
          return sampleCv({ title: input.title });
        },
        listByUserId: async () => [],
        findById: async () => null,
        updateOwned: async () => null,
        deleteOwned: async () => false,
      },
    });

    const result = await service.createCv({ title: "Engineering CV" });
    assert.equal(result.success, true);
    assert.equal(created, true);
  });

  it("2. User A can read their own CV", async () => {
    const owned: CvRecordWithOwner = { ...sampleCv(), userId: USER_A.id };
    const service = createCvService({
      getUser: async () => USER_A,
      repository: {
        create: async () => sampleCv(),
        listByUserId: async () => [],
        findById: async () => owned,
        updateOwned: async () => null,
        deleteOwned: async () => false,
      },
    });

    const result = await service.getCvForCurrentUser(CV_ID);
    assert.equal(result.success, true);
    if (result.success) {
      assert.equal(result.data.id, CV_ID);
      assert.equal("userId" in result.data, false);
    }
  });

  it("3. User A can update their own CV", async () => {
    const owned: CvRecordWithOwner = { ...sampleCv(), userId: USER_A.id };
    const service = createCvService({
      getUser: async () => USER_A,
      repository: {
        create: async () => sampleCv(),
        listByUserId: async () => [],
        findById: async () => owned,
        updateOwned: async (cvId, userId, input) => {
          assert.equal(cvId, CV_ID);
          assert.equal(userId, USER_A.id);
          assert.equal(input.title, "Updated title");
          return sampleCv({ title: input.title ?? "Updated title" });
        },
        deleteOwned: async () => false,
      },
    });

    const result = await service.updateCvForCurrentUser(CV_ID, {
      title: "Updated title",
    });
    assert.equal(result.success, true);
  });

  it("4. User A can delete their own CV", async () => {
    const owned: CvRecordWithOwner = { ...sampleCv(), userId: USER_A.id };
    const service = createCvService({
      getUser: async () => USER_A,
      repository: {
        create: async () => sampleCv(),
        listByUserId: async () => [],
        findById: async () => owned,
        updateOwned: async () => null,
        deleteOwned: async (cvId, userId) => {
          assert.equal(cvId, CV_ID);
          assert.equal(userId, USER_A.id);
          return true;
        },
      },
    });

    const result = await service.deleteCvForCurrentUser(CV_ID);
    assert.equal(result.success, true);
  });

  it("5. User B cannot read User A's CV", async () => {
    const owned: CvRecordWithOwner = { ...sampleCv(), userId: USER_A.id };
    const service = createCvService({
      getUser: async () => USER_B,
      repository: {
        create: async () => sampleCv(),
        listByUserId: async () => [],
        findById: async () => owned,
        updateOwned: async () => null,
        deleteOwned: async () => false,
      },
    });

    const result = await service.getCvForCurrentUser(CV_ID);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, CV_ERROR_CODES.FORBIDDEN);
    }
  });

  it("6. User B cannot update User A's CV", async () => {
    const owned: CvRecordWithOwner = { ...sampleCv(), userId: USER_A.id };
    const service = createCvService({
      getUser: async () => USER_B,
      repository: {
        create: async () => sampleCv(),
        listByUserId: async () => [],
        findById: async () => owned,
        updateOwned: async () => {
          throw new Error("Should not update cross-user CV");
        },
        deleteOwned: async () => false,
      },
    });

    const result = await service.updateCvForCurrentUser(CV_ID, {
      title: "Hacked",
    });
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, CV_ERROR_CODES.FORBIDDEN);
    }
  });

  it("7. User B cannot delete User A's CV", async () => {
    const owned: CvRecordWithOwner = { ...sampleCv(), userId: USER_A.id };
    const service = createCvService({
      getUser: async () => USER_B,
      repository: {
        create: async () => sampleCv(),
        listByUserId: async () => [],
        findById: async () => owned,
        updateOwned: async () => null,
        deleteOwned: async () => {
          throw new Error("Should not delete cross-user CV");
        },
      },
    });

    const result = await service.deleteCvForCurrentUser(CV_ID);
    assert.equal(result.success, false);
    if (!result.success) {
      assert.equal(result.error.code, CV_ERROR_CODES.FORBIDDEN);
    }
  });

  it("8. Unauthenticated users cannot perform CV operations", async () => {
    const service = createCvService({
      getUser: async () => null,
      repository: {
        create: async () => {
          throw new Error("Should not create when unauthenticated");
        },
        listByUserId: async () => {
          throw new Error("Should not list when unauthenticated");
        },
        findById: async () => {
          throw new Error("Should not read when unauthenticated");
        },
        updateOwned: async () => {
          throw new Error("Should not update when unauthenticated");
        },
        deleteOwned: async () => {
          throw new Error("Should not delete when unauthenticated");
        },
      },
    });

    const createResult = await service.createCv({ title: "Test" });
    const listResult = await service.listCvsForCurrentUser();
    const getResult = await service.getCvForCurrentUser(CV_ID);
    const updateResult = await service.updateCvForCurrentUser(CV_ID, {
      title: "Test",
    });
    const deleteResult = await service.deleteCvForCurrentUser(CV_ID);

    for (const result of [
      createResult,
      listResult,
      getResult,
      updateResult,
      deleteResult,
    ]) {
      assert.equal(result.success, false);
      if (!result.success) {
        assert.equal(result.error.code, CV_ERROR_CODES.UNAUTHENTICATED);
      }
    }
  });

  it("never trusts client-provided userId on create", async () => {
    const service = createCvService({
      getUser: async () => USER_A,
      repository: {
        create: async (input) => {
          assert.equal(input.userId, USER_A.id);
          return sampleCv();
        },
        listByUserId: async () => [],
        findById: async () => null,
        updateOwned: async () => null,
        deleteOwned: async () => false,
      },
    });

    await service.createCv({
      title: "Test",
      userId: USER_B.id,
    } as { title: string; userId: string });
  });
});
