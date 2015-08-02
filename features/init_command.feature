Feature: Init command
  In order to use Nodespec in my project
  As a Developer
  I want to be able to run a command that sets up Nodespec for use in my project

  Scenario: Nodespec config file is generated
    When I execute the init command
    Then I should see that Nodespec was initialized
    And the Nodespec config file should be present in the project
    And the Nodespec config file contains the default Nodespec config

  Scenario: Nodespec config file is not generated if it already exists
    Given I have already initialized Nodespec
    When I execute the init command
    Then I should see that Nodespec has already been initialized
    And the existing Nodespec config should be unaltered
