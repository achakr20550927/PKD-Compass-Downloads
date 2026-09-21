# Mac notarization

The manually dispatched `notarize-mac.yml` workflow notarizes already-signed
1.0.0 DMGs. It does not receive or use the Developer ID private key. It is
restricted to this repository's main branch and checks the exact input hashes
and signing team before submitting anything to Apple.

The account holder supplies `APPLE_NOTARY_PASSWORD` as an encrypted repository
secret. `APPLE_NOTARY_ID` is a repository variable. Neither belongs in source.
The password is scoped to the notarization step; downloaded apps only launch
in a later step without that credential in their environment. Remove the
repository secret after the release is complete if no further runs are needed.

The workflow requires Apple's Accepted result, staples and verifies both disk
images, checks Gatekeeper for the nested apps, and launches each architecture on
a matching runner. Both jobs must succeed before verified files replace the
draft assets. It never makes the draft public or updates the website itself.

On a processing timeout, the submission ID is in the run summary and log
artifact. Resume that same input using the corresponding dispatch input rather
than submitting it again. The workflow's checksums must not be relaxed to work
around a mismatch. After successful staging, the stapled assets have new hashes;
this one-time workflow should not be rerun against those changed draft assets.

Signing and notarization are not App Store review or a guarantee of medical
safety. The app remains a personal health organizer, not medical advice.
