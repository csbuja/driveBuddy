//
//  PVHFlipsideViewController.h
//  Pitstop Pal
//
//  Created by Colin Lockareff on 9/6/14.
//  Copyright (c) 2014 MHACKS PV. All rights reserved.
//

#import <UIKit/UIKit.h>

@class PVHFlipsideViewController;

@protocol PVHFlipsideViewControllerDelegate
- (void)flipsideViewControllerDidFinish:(PVHFlipsideViewController *)controller;
@end

@interface PVHFlipsideViewController : UIViewController

@property (weak, nonatomic) id <PVHFlipsideViewControllerDelegate> delegate;

- (IBAction)done:(id)sender;

@end
