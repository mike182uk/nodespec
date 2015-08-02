Feature: Run command
  In order to get feedback on a state of my application
  As a Developer
  I want to be able to run the specs

  Background:
    Given I have initialized Nodespec

  Scenario: Source file is created for object that does not exist
    Given I have already described the object "Foo"
    When I execute the run command and answer "y" to the question
    Then I should see that the source file for "Foo" was created
    And the source file for "Foo" should be present in the project

  Scenario: Source file is not created for object that does not exist when no is given as the answer to the question
    Given I have already described the object "Foo"
    When I execute the run command and answer "n" to the question
    Then the source file for "Foo" should not be present in the project

  Scenario: Spec runner is run
    Given I have already described the object "Foo"
    When I execute the run command and answer "y" to the question
    Then I should see that the spec runner has run

  Scenario: Multiple source files are created for objects that do not exist
    Given I have already described the object "Foo"
    And I have already described the object "Bar"
    When I execute the run command and answer "y,y" to the questions
    Then I should see that the source file for "Foo" was created
    And I should see that the source file for "Bar" was created
    And the source file for "Foo" should be present in the project
    And the source file for "Bar" should be present in the project

  Scenario: Source file is not created for an object that does not exist when no is given as an answer to a question
    Given I have already described the object "A"
    And I have already described the object "B"
    When I execute the run command and answer "n,y" to the questions
    Then the source file for "A" should not be present in the project
    And the source file for "B" should be present in the project

  Scenario: Source file is created for a specified object that does not exist
    Given I have already described the object "Foo"
    When I execute the run command with the argument "Foo" and answer "y" to the question
    Then I should see that the source file for "Foo" was created
    And the source file for "Foo" should be present in the project

  Scenario: Source file is created for a specified relative spec path for an object that does not exist
    Given I have already described the object "Foo"
    When I execute the run command with the argument "<specPath>/Foo<specSuffix>.js" and answer "y" to the question
    Then I should see that the source file for "Foo" was created
    And the source file for "Foo" should be present in the project

  Scenario: Source file is created for a specified absolute spec path for an object that does not exist
    Given I have already described the object "Foo"
    When I execute the run command with the argument "<absoluteSpecPath>/Foo<specSuffix>.js" and answer "y" to the question
    Then I should see that the source file for "Foo" was created
    And the source file for "Foo" should be present in the project

  Scenario: Spec runner is run for specified relative spec path
    Given I have already described the object "Foo"
    When I execute the run command with the argument "<specPath>/Foo<specSuffix>.js" and answer "y" to the question
    Then I should see that the spec runner has run

  Scenario: Spec runner is run for specified absolute spec path
    Given I have already described the object "Foo"
    When I execute the run command with the argument "<absoluteSpecPath>/Foo<specSuffix>.js" and answer "y" to the question
    Then I should see that the spec runner has run
