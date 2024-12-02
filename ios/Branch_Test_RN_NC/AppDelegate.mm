#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <RNBranch/RNBranch.h>
#import <Firebase.h>
#import <FirebaseMessaging/FirebaseMessaging.h>
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate () <UNUserNotificationCenterDelegate>
@end

@interface AppDelegate () <FIRMessagingDelegate>
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [application registerForRemoteNotifications];
  [UNUserNotificationCenter currentNotificationCenter].delegate = self;
  UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
      UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
  [[UNUserNotificationCenter currentNotificationCenter]
      requestAuthorizationWithOptions:authOptions
      completionHandler:^(BOOL granted, NSError * _Nullable error) {
      }];
  
  [FIRApp configure];
  [FIRMessaging messaging].delegate = self;
  [RNBranch enableLogging];
  // Add Snap partner parameters
//  [[Branch getInstance] addSnapPartnerParameterWithName:@"hashed_email_address"
//                                           value:@"11234e56af071e9c79927651156bd7a10bca8ac34672aba121056e2698ee7088"];
//  [[Branch getInstance] addSnapPartnerParameterWithName:@"hashed_phone_number"
//                                           value:@"534a4a8eafcd8489af32356d5a7a25f88c70cfe0448539a7c42964c1b897a359"];
//  
  // Check if this is the first app launch
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  if (![defaults boolForKey:@"HasSetIdentity"]) {
      // Set identity on first app launch
      [[Branch getInstance] setIdentity:@"Test123456789"];
      
      // Save the flag so this block won't run again
      [defaults setBool:YES forKey:@"HasSetIdentity"];
      [defaults synchronize];
  }
//  [[Branch getInstance] setIdentity:@"Test123456789"];
  
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
 
  self.moduleName = @"Branch_Test_RN_NC";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  

   NSURL *jsCodeLocation;
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  [RNBranch application:app openURL:url options:options];
  return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  [RNBranch continueUserActivity:userActivity];
  return YES;
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
    // Pass device token to Firebase
  [FIRMessaging messaging].APNSToken = deviceToken;
  [[FIRMessaging messaging] setAPNSToken:deviceToken];
}

- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
    NSLog(@"FCM registration token: %@", fcmToken);
    // Notify about received token.
    NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
    [[NSNotificationCenter defaultCenter] postNotificationName:
     @"FCMToken" object:nil userInfo:dataDict];
    // TODO: If necessary send token to application server.
    // Note: This callback is fired at each app startup and whenever a new token is generated.
}

@end
