# Hyundai AI — iOS-only

This repository is maintained as an iOS-only project. The `android/` folder is kept for history but should not be built or referenced by CI.

Quick actions
- Disable CI jobs that reference `android/` or invoke `gradle`:
  ./scripts/remove_android_ci.sh

- Perform a local clean iOS build:
  chmod +x ./scripts/ios_clean_build.sh
  ./scripts/ios_clean_build.sh --workspace ios/App.xcworkspace --scheme App

Notes
- The scripts create backups of modified CI files with a `.bak` extension.
- Inspect backups and modified CI files before committing changes.
