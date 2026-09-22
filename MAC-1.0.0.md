# PKD Compass 1.0.0 for Mac

Standalone Mac application with encrypted records stored on your computer. No
online account or health-data server is required. Updates and backups are manual.

## Installation

- Apple silicon (M-series): `PKD-Compass-1.0.0-mac-arm64.dmg`
- Intel: `PKD-Compass-1.0.0-mac-x64.dmg`
- macOS 13 or later.

Open the matching disk image and drag PKD Compass to Applications. Launch it
from Applications, not from inside the disk image. macOS may show the normal
confirmation for an app downloaded from the internet. Do not disable Gatekeeper.

If you installed an earlier preview, export an encrypted backup first, quit the
app, and replace the application with this release. The app's data directory is
separate, but a backup is essential. Old preview DMGs remain unnotarized; download
this release instead. Keep your vault passphrase safe: it cannot be reset.

## Verification

Both installers are signed by Developer ID Application: RAGHAV V CHAKRAVARTHY
(3ALPX54S5P). Apple accepted both submissions with "Ready for distribution" and
no reported issues. Notarization tickets are stapled to both DMGs.

Gatekeeper accepted both DMGs and their nested apps as `Notarized Developer ID`.
Each app launched on a matching Apple silicon or Intel GitHub-hosted Mac. Final
downloaded DMGs also passed checksum, signature, stapled-ticket, and Gatekeeper
checks locally.

[Verification run](https://github.com/achakr20550927/PKD-Compass-Downloads/actions/runs/35777069125)

SHA-256 checksums:

```text
ec4978164bd51d45261bb77c4ce1d6d442a4cfc1cd0ae382fd956c9c595d9d8d  PKD-Compass-1.0.0-mac-arm64.dmg
a722b7cb34664c86a983fb960ae8fd1b4fa1622e37b24d7502f435c5486d29ec  PKD-Compass-1.0.0-mac-x64.dmg
```

Source-level verification: seven storage tests and eight release-guard tests
passed. The desktop smoke test passed vault creation, encryption, export,
restart persistence, locking, deletion, restore, renderer sandbox, and blocked
outbound network checks. These checks are not a guarantee of zero defects or
medical safety, and notarization is not App Store approval.

## Scope and limitations

Manual labs, symptoms, blood pressure and CSV reports, food/nutrients/fluids,
medication logs, documents, appointments, tasks, profile, and encrypted backup
and restore. Records stay in the app's local encrypted database. External
resource links open only when selected, in the system browser.

Cloud sync, caregiver sharing, AI analysis, barcode lookup, and background
reminders are not included. Use a separate reminder app for time-critical
alerts. Exported reports and documents are unencrypted; vault backups are
encrypted. Device loss, deletion of app data, or a forgotten passphrase can
make records unrecoverable. Keep regular encrypted backups.

Windows remains a separate unsigned testing preview. iPhone and iPad have a
separate web edition, not a native installer. This release is for personal
health organization, not medical advice, diagnosis, or treatment.
