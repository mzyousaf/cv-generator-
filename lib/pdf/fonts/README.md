# PDF fonts

Bundled for server-side PDF export (`lib/pdf/fonts.ts`). All are licensed under the
SIL Open Font License 1.1 and were downloaded from Google Fonts.

| File | Family | Used for |
| --- | --- | --- |
| `NotoSans-*` | Noto Sans | Latin, Greek and Cyrillic documents (sans templates) |
| `NotoSerif-*` | Noto Serif | Serif templates |
| `IBMPlexSansArabic-*` | IBM Plex Sans Arabic | Arabic documents (correct letter joining, includes Latin) |
| `NotoSansSC-*` | Noto Sans SC | Chinese documents, subset to GB2312 + Latin + punctuation |

The Chinese files were subset with `pyftsubset` to keep the repository small; characters
outside GB2312 fall back to the other families.
