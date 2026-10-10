import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  fetchAccountPhotoDataUrl,
  isAllowedAccountPhotoUrl,
  largerGoogleAvatarUrl,
} from "@/lib/cv/account-photo";
import { createCvService } from "@/lib/cv/service";
import type { CurrentUser } from "@/lib/auth/get-current-user";
import type { CvRecord } from "@/lib/cv/repository";

const AVATAR = "https://lh3.googleusercontent.com/a/abc123=s96-c";
const JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 4]);

function fakeFetch(body: Buffer, type: string, status = 200) {
  const calls: string[] = [];
  const impl = (async (url: string) => {
    calls.push(String(url));
    return new Response(new Uint8Array(body), { status, headers: { "content-type": type } });
  }) as unknown as typeof fetch;
  return { impl, calls };
}

describe("account photo", () => {
  it("only fetches Google avatar hosts over https", () => {
    assert.equal(isAllowedAccountPhotoUrl(AVATAR), true);
    assert.equal(isAllowedAccountPhotoUrl("http://lh3.googleusercontent.com/a/x"), false);
    assert.equal(isAllowedAccountPhotoUrl("https://evil.example.com/a.jpg"), false);
    assert.equal(isAllowedAccountPhotoUrl("https://googleusercontent.com.evil.io/a"), false);
    assert.equal(isAllowedAccountPhotoUrl("not a url"), false);
  });

  it("asks Google for a CV-sized avatar", () => {
    assert.equal(largerGoogleAvatarUrl(AVATAR), "https://lh3.googleusercontent.com/a/abc123=s400-c");
    assert.equal(largerGoogleAvatarUrl("https://lh3.googleusercontent.com/a/x"), "https://lh3.googleusercontent.com/a/x");
  });

  it("returns a JPEG data URL for a valid avatar", async () => {
    const { impl, calls } = fakeFetch(JPEG, "image/jpeg");
    const photo = await fetchAccountPhotoDataUrl(AVATAR, impl);
    assert.equal(photo, `data:image/jpeg;base64,${JPEG.toString("base64")}`);
    assert.match(calls[0], /=s400-c$/);
  });

  it("returns null for missing, unsupported or failed pictures", async () => {
    assert.equal(await fetchAccountPhotoDataUrl(undefined), null);
    assert.equal(await fetchAccountPhotoDataUrl(AVATAR, fakeFetch(JPEG, "image/webp").impl), null);
    assert.equal(await fetchAccountPhotoDataUrl(AVATAR, fakeFetch(JPEG, "image/jpeg", 404).impl), null);
    assert.equal(
      await fetchAccountPhotoDataUrl(AVATAR, fakeFetch(Buffer.alloc(400_000, 1), "image/jpeg").impl),
      null,
    );
    const broken = (async () => {
      throw new Error("network");
    }) as unknown as typeof fetch;
    assert.equal(await fetchAccountPhotoDataUrl(AVATAR, broken), null);
  });
});

describe("new CVs use the account picture", () => {
  const user: CurrentUser = {
    id: "aaaaaaaaaaaaaaaaaaaaaaaa",
    email: "a@example.com",
    name: "A",
    image: AVATAR,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const ACCOUNT_PHOTO = `data:image/jpeg;base64,${JPEG.toString("base64")}`;
  const IMPORTED_PHOTO = "data:image/png;base64,iVBORw0KGgo=";

  function serviceWith(accountPhoto: string | null) {
    let saved: Record<string, unknown> | null = null;
    const service = createCvService({
      getUser: async () => user,
      getAccountPhoto: async () => accountPhoto,
      repository: {
        create: async (input) => {
          saved = input.content as Record<string, unknown>;
          return { id: "507f1f77bcf86cd799439011", title: input.title, template: input.template, content: input.content, createdAt: "", updatedAt: "" } as CvRecord;
        },
        listByUserId: async () => [],
        findById: async () => null,
        updateOwned: async () => null,
        deleteOwned: async () => false,
      },
    });
    return { service, saved: () => saved as { personal?: { photo?: string; fullName?: string } } | null };
  }

  it("replaces any other photo with the account picture", async () => {
    const { service, saved } = serviceWith(ACCOUNT_PHOTO);
    const result = await service.createCv({
      title: "Imported",
      content: { personal: { fullName: "Jane", photo: IMPORTED_PHOTO } },
    });
    assert.equal(result.success, true);
    assert.equal(saved()?.personal?.photo, ACCOUNT_PHOTO);
    assert.equal(saved()?.personal?.fullName, "Jane");
  });

  it("adds the account picture to a blank CV", async () => {
    const { service, saved } = serviceWith(ACCOUNT_PHOTO);
    await service.createCv({ title: "Blank" });
    assert.equal(saved()?.personal?.photo, ACCOUNT_PHOTO);
  });

  it("keeps the imported photo when the account has no picture", async () => {
    const { service, saved } = serviceWith(null);
    await service.createCv({ title: "Imported", content: { personal: { photo: IMPORTED_PHOTO } } });
    assert.equal(saved()?.personal?.photo, IMPORTED_PHOTO);
  });
});
