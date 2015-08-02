Feature: Describe command
  In order to avoid repetitive tasks and interruptions in development flow
  As a Developer
  I want to automate the creation of specs

  Background:
    Given I have initialized Nodespec

  Scenario Outline: Spec is generated for object being described
    When I describe the object "<object name>"
    Then I should see that a spec was created for "<object name>"
    And the spec for "<object name>" should be present in the project

    Examples:
      | object name |
      | Foo         |
      | Foo/Bar     |
      | Foo/Bar/Baz |

  Scenario: Spec is generated for object being described when the describe command alias is used
    When I describe the object "Foo" using the describe command alias
    Then I should see that a spec was created for "Foo"
    And the spec for "Foo" should be present in the project

  Scenario: Spec is not generated if it already exists
    Given I have already described the object "Foo"
    When I describe the object "Foo"
    Then I should see that a spec for "Foo" already exists
    And the existing spec for "Foo" should be unaltered

  Scenario Outline: Error is shown if the name of the object being described is invalid
    When I describe the object "<invalid object name>"
    Then I should see that the object name is invalid

    Examples:
      | invalid object name |
      | Foo#                |
      | Foo~Bar             |
      | Foo/{Bar            |
