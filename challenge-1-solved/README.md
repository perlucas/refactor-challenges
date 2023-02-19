# Refactoring Challenge #1

This very simple express API contains a route that calls a _reports controller_, which then creates a set of reports and sends them by email. Each report may contain very different information. These 2 sample reports contain information about the distribution of users in company departments. Data needed to build each report is retrieved by a company internal API.

Here are the design considerations the refactored version should meet:
- mail formatting should be easy to change/extend (e.g.: add an email signature, add colors)
- these are reports sent through email, but this code should easily support other types of reports, that may be sent through different means (e.g: an excel report that is to be stored in a FTP server, a report that is sent to admin users' phones via SMS)
- it should be easy to change the structure of the existing reports, and add new ones that may be based on custom data (e.g.: reports that don't contain users/departments information, a monthly revenue report)
- there might be different recipients for each report, and there might be reports with no clear recipients at all (e.g.: the FTP excel report mentioned above)
- it should be easy to change current vendors as for HTTP clients, mailing services and dependencies
- it should be easy to support different error handling strategies according to the error type thrown during this endpoint's execution