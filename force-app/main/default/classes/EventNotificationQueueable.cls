public class EventNotificationQueueable
implements Queueable {

    private Id eventId;

    public EventNotificationQueueable(
        Id eventId
    ) {

        this.eventId = eventId;
    }

    public void execute(
        QueueableContext context
    ) {

        Event__c evt = [

            SELECT Id,
                   Name,
                   Type__c,
                   Start_DateTime__c

            FROM Event__c

            WHERE Id = :eventId

            LIMIT 1
        ];

        Event_Notification__e platformEvent =
            new Event_Notification__e(

                Event_Name__c =
                    evt.Name,

                Event_Type__c =
                    evt.Type__c,

                Start_Time__c =
                    evt.Start_DateTime__c
            );

        Database.SaveResult result =

            EventBus.publish(
                platformEvent
            );

        System.debug(
            'Platform Event Published'
        );
    }
}