//
//  Scheduler.h
//  Pitstop Pal
//
//  Created by CHRISTOPHER SPENCER BUJA on 9/6/14.
//  Copyright (c) 2014 MHACKS PV. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface Scheduler : NSObject

@property (nonatomic, assign) NSArray * startLatLon;
@property (nonatomic, assign) NSArray * finishLatLon;

- (id)initScheduler:(NSArray*)startLatLon finishLatLon:(NSArray*) finishLatLon;

@end
