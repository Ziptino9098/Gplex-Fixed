// Gplex+ for iOS: plus.gplexextended.com in a web view, with a Theme list of Gplex's layouts. The site
// serves the Gplex+ part of Gplex to the app (it knows the app by its User-Agent), and reads the chosen
// layout from the cookie gplex_theme that this app keeps. Two builds from this one file:
//   GP_LEGACY=1  iOS 6 to 13, UIWebView, armv7 and arm64, no ARC, a .deb into /Applications
//   GP_LEGACY=0  iOS 14 and later, WKWebView, arm64, an unsigned .ipa (AppSync Unified, TrollStore)
#import <UIKit/UIKit.h>
#if !GP_LEGACY
#import <WebKit/WebKit.h>
#endif

#define GP_HOME @"https://plus.gplexextended.com/"
#define GP_HOST @"plus.gplexextended.com"
#define GP_THEME_KEY @"GplexTheme"
#if GP_LEGACY
#define GP_UA @"GplexPlusLegacy/1.0"
#else
#define GP_UA @"GplexPlusApp/1.0"
#endif

#if GP_LEGACY
#define GP_RELEASE(x) [x release]
#define GP_AUTORELEASE(x) [x autorelease]
#else
#define GP_RELEASE(x)
#define GP_AUTORELEASE(x) x
#endif

// ---- the themes: Gplex's layouts, from themes.plist in the bundle (made from the script's own menu)
static NSArray *gpThemes(void) {
    static NSArray *themes = nil;
    if (!themes) {
        NSString *p = [[NSBundle mainBundle] pathForResource:@"themes" ofType:@"plist"];
        themes = p ? [[NSArray alloc] initWithContentsOfFile:p] : nil;
        if (!themes) {
            themes = [[NSArray alloc] init];
        }
    }
    return themes;
}

static NSString *gpTheme(void) {
    NSString *v = [[NSUserDefaults standardUserDefaults] stringForKey:GP_THEME_KEY];
    return v ? v : @"";
}

// the cookie the site reads the layout from (for the site's own pages and for the served Gplex part)
static void gpSetThemeCookie(NSString *value, void (^done)(void)) {
    NSMutableDictionary *p = [NSMutableDictionary dictionary];
    [p setObject:@"gplex_theme" forKey:NSHTTPCookieName];
    [p setObject:(value ? value : @"") forKey:NSHTTPCookieValue];
    [p setObject:GP_HOST forKey:NSHTTPCookieDomain];
    [p setObject:@"/" forKey:NSHTTPCookiePath];
    [p setObject:[NSDate dateWithTimeIntervalSinceNow:10 * 365 * 86400.0] forKey:NSHTTPCookieExpires];
    [p setObject:@"TRUE" forKey:NSHTTPCookieSecure];
    NSHTTPCookie *c = [NSHTTPCookie cookieWithProperties:p];
    if (!c) {
        if (done) {
            done();
        }
        return;
    }
    [[NSHTTPCookieStorage sharedHTTPCookieStorage] setCookie:c];
#if GP_LEGACY
    if (done) {
        done();
    }
#else
    // WKWebView keeps its own cookie jar
    [[WKWebsiteDataStore defaultDataStore].httpCookieStore setCookie:c completionHandler:^{
        if (done) {
            dispatch_async(dispatch_get_main_queue(), done);
        }
    }];
#endif
}

@class GPViewController;

// ---- the Theme list
@interface GPThemeController : UITableViewController
@property (nonatomic, assign) GPViewController *owner;
@end

// ---- the page
#if GP_LEGACY
@interface GPViewController : UIViewController <UIWebViewDelegate>
@property (nonatomic, retain) UIWebView *web;
#else
@interface GPViewController : UIViewController <WKNavigationDelegate, WKUIDelegate>
@property (nonatomic, strong) WKWebView *web;
#endif
- (void)themeChanged;
- (void)goHome;
@end

@implementation GPViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"Gplex+";
    self.view.backgroundColor = [UIColor whiteColor];
    if ([self respondsToSelector:@selector(setEdgesForExtendedLayout:)]) {
        self.edgesForExtendedLayout = UIRectEdgeNone;   // (iOS 7+) the page below the bars, not under them
    }
    UIBarButtonItem *themeBtn = [[UIBarButtonItem alloc] initWithTitle:@"Theme" style:UIBarButtonItemStylePlain target:self action:@selector(pickTheme)];
    self.navigationItem.rightBarButtonItem = themeBtn;
    GP_RELEASE(themeBtn);
    UIBarButtonItem *back = [[UIBarButtonItem alloc] initWithTitle:@"‹ Back" style:UIBarButtonItemStylePlain target:self action:@selector(goBack)];
    UIBarButtonItem *fwd = [[UIBarButtonItem alloc] initWithTitle:@"Forward ›" style:UIBarButtonItemStylePlain target:self action:@selector(goForward)];
    UIBarButtonItem *home = [[UIBarButtonItem alloc] initWithTitle:@"Home" style:UIBarButtonItemStylePlain target:self action:@selector(goHome)];
    UIBarButtonItem *reload = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemRefresh target:self action:@selector(reload)];
    UIBarButtonItem *flex1 = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace target:nil action:nil];
    UIBarButtonItem *flex2 = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace target:nil action:nil];
    self.toolbarItems = [NSArray arrayWithObjects:back, fwd, flex1, home, flex2, reload, nil];
    GP_RELEASE(back);
    GP_RELEASE(fwd);
    GP_RELEASE(home);
    GP_RELEASE(reload);
    GP_RELEASE(flex1);
    GP_RELEASE(flex2);

    CGRect r = self.view.bounds;
#if GP_LEGACY
    UIWebView *w = [[UIWebView alloc] initWithFrame:r];
    w.delegate = self;
    w.scalesPageToFit = YES;
#else
    WKWebViewConfiguration *cfg = [[WKWebViewConfiguration alloc] init];
    cfg.applicationNameForUserAgent = GP_UA;
    WKWebView *w = [[WKWebView alloc] initWithFrame:r configuration:cfg];
    w.navigationDelegate = self;
    w.UIDelegate = self;
    w.allowsBackForwardNavigationGestures = YES;
#endif
    w.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
    [self.view addSubview:w];
    self.web = w;
    GP_RELEASE(w);

    NSString *theme = gpTheme();
    gpSetThemeCookie(theme, ^{
        [self goHome];
    });
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.navigationController setToolbarHidden:NO animated:animated];
}

- (void)load:(NSURL *)url {
    NSMutableURLRequest *req = [NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:30];
    [self.web loadRequest:req];
}

- (void)goHome {
    [self load:[NSURL URLWithString:GP_HOME]];
}

- (void)goBack {
    if ([self.web canGoBack]) {
        [self.web goBack];
    }
}

- (void)goForward {
    if ([self.web canGoForward]) {
        [self.web goForward];
    }
}

- (void)reload {
    [self.web reload];
}

- (void)pickTheme {
    GPThemeController *t = [[GPThemeController alloc] initWithStyle:UITableViewStylePlain];
    t.owner = self;
    [self.navigationController pushViewController:t animated:YES];
    GP_RELEASE(t);
}

- (void)themeChanged {
    gpSetThemeCookie(gpTheme(), ^{
        [self.web reload];
    });
}

- (void)showError:(NSString *)why {
    NSString *h = [NSString stringWithFormat:@"<html><head><meta name=\"viewport\" content=\"width=device-width\"><style>body{font:16px/1.5 Helvetica,Arial,sans-serif;color:#222;padding:40px 24px;text-align:center}"
                   @"a{color:#dd4b39}</style></head><body><p><b>Gplex+ could not be reached.</b></p><p>%@</p><p><a href=\"%@\">Try again</a></p></body></html>",
                   why ? why : @"", GP_HOME];
#if GP_LEGACY
    [self.web loadHTMLString:h baseURL:[NSURL URLWithString:GP_HOME]];
#else
    [self.web loadHTMLString:h baseURL:[NSURL URLWithString:GP_HOME]];
#endif
}

#if GP_LEGACY
// ---- UIWebView
- (void)webViewDidStartLoad:(UIWebView *)webView {
    [UIApplication sharedApplication].networkActivityIndicatorVisible = YES;
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    [UIApplication sharedApplication].networkActivityIndicatorVisible = NO;
    if ([error code] == NSURLErrorCancelled) {
        return;
    }
    [self showError:[error localizedDescription]];
}

- (void)dealloc {
    self.web.delegate = nil;
    self.web = nil;
    [super dealloc];
}
#else
// ---- WKWebView
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)action decisionHandler:(void (^)(WKNavigationActionPolicy))decide {
    // a link meant for a new window opens here instead
    if (!action.targetFrame) {
        [webView loadRequest:action.request];
        decide(WKNavigationActionPolicyCancel);
        return;
    }
    decide(WKNavigationActionPolicyAllow);
}

- (WKWebView *)webView:(WKWebView *)webView createWebViewWithConfiguration:(WKWebViewConfiguration *)configuration
      forNavigationAction:(WKNavigationAction *)action windowFeatures:(WKWindowFeatures *)windowFeatures {
    [webView loadRequest:action.request];
    return nil;
}

- (void)webView:(WKWebView *)webView didFailProvisionalNavigation:(WKNavigation *)navigation withError:(NSError *)error {
    if ([error code] == NSURLErrorCancelled) {
        return;
    }
    [self showError:[error localizedDescription]];
}

// the page's alert(), confirm() and prompt() as the system's own sheets
- (void)webView:(WKWebView *)webView runJavaScriptAlertPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(void))done {
    UIAlertController *a = [UIAlertController alertControllerWithTitle:@"Gplex+" message:message preferredStyle:UIAlertControllerStyleAlert];
    [a addAction:[UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(UIAlertAction *x) { done(); }]];
    [self presentViewController:a animated:YES completion:nil];
}

- (void)webView:(WKWebView *)webView runJavaScriptConfirmPanelWithMessage:(NSString *)message initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(BOOL))done {
    UIAlertController *a = [UIAlertController alertControllerWithTitle:@"Gplex+" message:message preferredStyle:UIAlertControllerStyleAlert];
    [a addAction:[UIAlertAction actionWithTitle:@"Cancel" style:UIAlertActionStyleCancel handler:^(UIAlertAction *x) { done(NO); }]];
    [a addAction:[UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault handler:^(UIAlertAction *x) { done(YES); }]];
    [self presentViewController:a animated:YES completion:nil];
}
#endif

@end

// ---- the Theme list
@implementation GPThemeController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.title = @"Theme";
}

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return (NSInteger)[gpThemes() count] + 1;
}

- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    return @"Gplex+ as Google+ looked in the year of a Gplex layout";
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)ip {
    static NSString *cid = @"theme";
    UITableViewCell *c = [tableView dequeueReusableCellWithIdentifier:cid];
    if (!c) {
        c = GP_AUTORELEASE([[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:cid]);
    }
    NSString *cur = gpTheme();
    if (ip.row == 0) {
        c.textLabel.text = @"Gplex+'s own look";
        c.detailTextLabel.text = @"No Gplex theme";
        c.accessoryType = [cur length] == 0 ? UITableViewCellAccessoryCheckmark : UITableViewCellAccessoryNone;
        return c;
    }
    NSDictionary *t = [gpThemes() objectAtIndex:(NSUInteger)(ip.row - 1)];
    c.textLabel.text = [t objectForKey:@"label"];
    c.detailTextLabel.text = [t objectForKey:@"look"];
    c.accessoryType = [cur isEqualToString:[t objectForKey:@"value"]] ? UITableViewCellAccessoryCheckmark : UITableViewCellAccessoryNone;
    return c;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)ip {
    NSString *v = @"";
    if (ip.row > 0) {
        v = [[gpThemes() objectAtIndex:(NSUInteger)(ip.row - 1)] objectForKey:@"value"];
    }
    [[NSUserDefaults standardUserDefaults] setObject:v forKey:GP_THEME_KEY];
    [[NSUserDefaults standardUserDefaults] synchronize];
    [tableView reloadData];
    [self.owner themeChanged];
    [self.navigationController popViewControllerAnimated:YES];
}

@end

// ---- the app
@interface GPAppDelegate : UIResponder <UIApplicationDelegate>
#if GP_LEGACY
@property (nonatomic, retain) UIWindow *window;
#else
@property (nonatomic, strong) UIWindow *window;
#endif
@end

@implementation GPAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
#if GP_LEGACY
    // UIWebView takes its User-Agent from the defaults, read once before the first web view is made
    UIWebView *probe = [[UIWebView alloc] initWithFrame:CGRectZero];
    NSString *ua = [probe stringByEvaluatingJavaScriptFromString:@"navigator.userAgent"];
    GP_RELEASE(probe);
    if ([ua length]) {
        [[NSUserDefaults standardUserDefaults] registerDefaults:[NSDictionary dictionaryWithObject:[ua stringByAppendingFormat:@" %@", GP_UA] forKey:@"UserAgent"]];
    }
#endif
    UIWindow *win = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    self.window = win;
    GP_RELEASE(win);
    GPViewController *root = [[GPViewController alloc] init];
    UINavigationController *nav = [[UINavigationController alloc] initWithRootViewController:root];
    GP_RELEASE(root);
    self.window.rootViewController = nav;
    GP_RELEASE(nav);
    self.window.backgroundColor = [UIColor whiteColor];
    [self.window makeKeyAndVisible];
    return YES;
}

#if GP_LEGACY
- (void)dealloc {
    self.window = nil;
    [super dealloc];
}
#endif

@end

int main(int argc, char *argv[]) {
    @autoreleasepool {
        return UIApplicationMain(argc, argv, nil, @"GPAppDelegate");
    }
}
