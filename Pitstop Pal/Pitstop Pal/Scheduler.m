//
//  Scheduler.m
//  Pitstop Pal
//
//  Created by CHRISTOPHER SPENCER BUJA on 9/6/14.
//  Copyright (c) 2014 MHACKS PV. All rights reserved.
//

#import "Scheduler.h"

@implementation Scheduler

- (id)initScheduler:(NSArray*)startLatLon finishLatLon:(NSArray*) finishLatLon
{
    if (self = [super init])
    {
        _startLatLon = startLatLon;
        _finishLatLon = finishLatLon;
        
    }
    return self;
}
@end
