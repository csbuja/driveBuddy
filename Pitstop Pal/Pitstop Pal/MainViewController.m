//
//  MainViewController.m
//  Pitstop Pal
//
//  Created by Colin Lockareff on 9/6/14.
//  Copyright (c) 2014 MHACKS PV. All rights reserved.
//

#import "MainViewController.h"
#import <GoogleMaps/GoogleMaps.h>
#import <CoreLocation/CoreLocation.h>

@interface MainViewController () <CLLocationManagerDelegate>
@property (weak, nonatomic) IBOutlet UILabel *longitudeValue;
@property (weak, nonatomic) IBOutlet UILabel *latitudeValue;
@property (nonatomic,strong) CLLocationManager *locationManager;
- (IBAction)buttonPressed:(id)sender;
@end


@implementation MainViewController {
    GMSMapView *mapView_;
    CLLocationManager *manager;
}

- (void)viewDidLoad {
    // Create a GMSCameraPosition that tells the map to display the
    // coordinate -33.86,151.20 at zoom level 6.
    [super viewDidLoad];
    
    manager = [[CLLocationManager alloc] init];
    
    if ([CLLocationManager locationServicesEnabled]) {
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
        [self.locationManager startUpdatingLocation];
    } else {
        NSLog(@"Location services are not enabled");
    }
    self.latitudeValue.text = @"50.0";
    
//    GMSCameraPosition *camera = [GMSCameraPosition cameraWithLatitude:-33.86
//                                                            longitude:151.20
//                                                                 zoom:6];
//    mapView_ = [GMSMapView mapWithFrame:CGRectZero camera:camera];
//    mapView_.myLocationEnabled = YES;
//    self.view = mapView_;
//    
//    // Creates a marker in the center of the map.
//    GMSMarker *marker = [[GMSMarker alloc] init];
//    marker.position = CLLocationCoordinate2DMake(-33.86, 151.20);
//    marker.title = @"Sydney";
//    marker.snippet = @"Australia";
//    marker.map = mapView_;
}

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{
    CLLocation *location = [locations lastObject];
    self.latitudeValue.text = [NSString stringWithFormat:@"%f", location.coordinate.latitude];
    self.latitudeValue.text = @"40.0";
    self.longitudeValue.text = [NSString stringWithFormat:@"%f", location.coordinate.longitude];
}

- (IBAction)buttonPressed:(id)sender {
}
@end