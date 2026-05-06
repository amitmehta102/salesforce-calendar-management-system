public with sharing class CalendarController {

    @AuraEnabled(cacheable=true)
    public static List<Event__c> getEvents() {

        return [
            SELECT Id,
                 Name,
                 Start_DateTime__c,
                 End_DateTime__c,
                 Type__c
            FROM Event__c
        ];
    }
   @AuraEnabled(cacheable=true)
public static Boolean isConflict(
    String startDate,
    String endDate
) {

    Datetime startDT =
        Datetime.valueOfGmt(
            startDate.replace('T', ' ') + ':00'
        );

    Datetime endDT =
        Datetime.valueOfGmt(
            endDate.replace('T', ' ') + ':00'
        );

    List<Event__c> conflicts = [

        SELECT Id,
               Name
        FROM Event__c

        WHERE Start_DateTime__c < :endDT
        AND End_DateTime__c > :startDT
    ];

    return !conflicts.isEmpty();
}

   @AuraEnabled
   public static void createEvent(
    String eventName,
    String startDate,
    String endDate
) {

    try {

        String formattedStart =
            startDate.replace('T', ' ') + ':00';

        String formattedEnd =
            endDate.replace('T', ' ') + ':00';

        Event__c newEvent = new Event__c();

        newEvent.Name = eventName;

        newEvent.Start_DateTime__c =
            Datetime.valueOf(formattedStart);

        newEvent.End_DateTime__c =
            Datetime.valueOf(formattedEnd);

        insert newEvent;

    } catch(Exception e) {

        throw new AuraHandledException(
            e.getMessage()
        );
    }
}
    @AuraEnabled
    public static void deleteEvent(Id eventId) {

    delete [
        SELECT Id
        FROM Event__c
        WHERE Id = :eventId
    ];
}
    @AuraEnabled
    public static void updateEventDate(
    Id eventId,
    String startDate,
    String endDate
) {

    Event__c existingEvent = [

        SELECT Id,
               Start_DateTime__c,
               End_DateTime__c

        FROM Event__c

        WHERE Id = :eventId

        LIMIT 1
    ];

    existingEvent.Start_DateTime__c =
        Datetime.valueOf(
            startDate.replace('T', ' ') + ':00'
        );

    existingEvent.End_DateTime__c =
        Datetime.valueOf(
            endDate.replace('T', ' ') + ':00'
        );

    update existingEvent;
}
    @AuraEnabled
    public static void updateEvent(
    Id eventId,
    String eventName,
    String startDate,
    String endDate
) {

    Event__c evt = [

        SELECT Id,
               Name,
               Start_DateTime__c,
               End_DateTime__c

        FROM Event__c

        WHERE Id = :eventId

        LIMIT 1
    ];

    evt.Name = eventName;

    evt.Start_DateTime__c =
        Datetime.valueOf(
            startDate.replace('T', ' ') + ':00'
        );

    evt.End_DateTime__c =
        Datetime.valueOf(
            endDate.replace('T', ' ') + ':00'
        );

    update evt;
}
}