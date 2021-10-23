import {useEffect} from 'react';
import {Alert, AppState, Linking, Platform} from 'react-native';
import VersionCheck from 'react-native-version-check';
import DeviceInfo from 'react-native-device-info';

function useVersionCheck() {
  const checkVersion = async () => {
    const bundleId = DeviceInfo.getBundleId();

    const appStoreUrl =
      'https://apps.apple.com/us/app/therapy-corner-guardian/id1552471531';
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${bundleId}`;

    try {
      const currentVersion = await VersionCheck.getCurrentVersion();
      const latestVersion = await VersionCheck.getLatestVersion({
        provider: Platform.OS === 'android' ? 'playStore' : 'appStore',
        packageName: bundleId,
      });

      const needsUpdate = (
        await VersionCheck.needUpdate({
          currentVersion,
          latestVersion,
        })
      ).isNeeded;

      if (needsUpdate) {
        Alert.alert(
          'Upgrade Required',
          'A new version of app is detected. Please download the latest version to continue using the app.',
          [
            {
              text: 'Go To Download',
              onPress: () => {
                const storeUrl =
                  Platform.OS === 'android' ? playStoreUrl : appStoreUrl;

                Linking.canOpenURL(storeUrl)
                  .then(() => {
                    Linking.openURL(storeUrl);
                  })
                  .catch();
              },
            },
          ],
        );
      }
    } catch (err) {}
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    checkVersion();

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      checkVersion();
    }
  };

  return null;
}

export default useVersionCheck;
