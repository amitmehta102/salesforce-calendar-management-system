trigger EventTrigger on Event__c (

    before insert,
    before update,
    after insert
) {

    // BEFORE EVENTS

    if(Trigger.isBefore) {

        for(Event__c evt : Trigger.new) {

            if(evt.Start_DateTime__c >=
               evt.End_DateTime__c) {

                evt.addError(
                    'End date must be after start date'
                );
            }

            List<Event__c> conflicts = [

                SELECT Id
                FROM Event__c

                WHERE Id != :evt.Id

                AND Start_DateTime__c <
                    :evt.End_DateTime__c

                AND End_DateTime__c >
                    :evt.Start_DateTime__c
            ];

            if(!conflicts.isEmpty()) {

                evt.addError(
                    'Event time conflicts with existing event'
                );
            }
        }
    }

    // AFTER INSERT

    if(Trigger.isAfter &&
       Trigger.isInsert) {

        for(Event__c evt : Trigger.new) {

            System.enqueueJob(

                new EventNotificationQueueable(
                    evt.Id
                )
            );
        }
    }
}