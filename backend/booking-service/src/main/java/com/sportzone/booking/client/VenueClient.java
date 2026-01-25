package com.sportzone.booking.client;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "venue-service")
public interface VenueClient {
    // Define methods to call Venue Service if needed, e.g. to validate court exists
    // @GetMapping("/api/venues/courts/{id}")
    // CourtDto getCourtById(@PathVariable Long id);
}
