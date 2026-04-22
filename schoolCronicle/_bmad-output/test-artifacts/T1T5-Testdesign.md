# T1T5 Test Design Approach

## Overview

**T1T5 Test Design** is a scenario-based testing approach that
structures test cases around realistic user scenarios. The method
organizes tests into five categories (T1--T5), each representing a
different type of interaction with the system.

Scenario-based testing uses stories or situations that represent
real-world user behavior. These scenarios help testers evaluate whether
the system behaves correctly across complete workflows and business
processes.

The approach ensures that testing reflects how end users actually
interact with the software and helps identify defects that might not be
detected through isolated functional tests.

------------------------------------------------------------------------

## Purpose of Scenario-Based Testing

Scenario testing aims to validate the end-to-end functioning of a system
and its business processes.

Key characteristics:

-   Testers think and act like real end users
-   Scenarios represent realistic workflows
-   Stakeholders, developers, and clients can contribute to defining
    scenarios
-   Tests evaluate process flows rather than isolated functions

This method helps uncover integration and workflow defects that other
testing approaches may overlook.

------------------------------------------------------------------------

## Origin of the T1T5 Approach

The term **T1T5 Test Design** was introduced during the RBI Group
Digital Solution (GDS) program as the result of a test design workshop.

The naming scheme is derived from scenario cards developed by
MaibornWolff. Initially used by the GDS-Newton team, the method was
later adopted across other projects and became a shared testing
practice.

------------------------------------------------------------------------

## The Five Scenario Types

  -----------------------------------------------------------------------
ID                      Scenario Type           Description
  ----------------------- ----------------------- -----------------------
T1                      Standard Case           The main workflow that
achieves the desired
goal. Often called the
Happy Path.

T2                      Alternative Case        A different valid way
to achieve the same
goal as the standard
case.

T3                      Exception Case          A deviation from the
normal flow where the
system must handle
unexpected situations.

T4                      Negative Case           Invalid input or state
that must be rejected
by the system.

T5                      Misuse Case             Deliberate misuse or
manipulation attempts
to test system
robustness.
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## Scenario Descriptions

### T1 --- Standard Case (Happy Path)

The standard case represents the normal and most common user
interaction.

Characteristics:

-   Intended system usage
-   Ideal workflow
-   Successful outcome

Example:

T1_login_validUserWithCorrectPassword_userIsLoggedInAndGetsToken

------------------------------------------------------------------------

### T2 --- Alternative Case

The alternative case describes another valid way to achieve the same
goal.

Characteristics:

-   Same goal as T1
-   Different interaction sequence
-   Still a valid scenario

Example:

T2_login_validUserWithValidIdCard_userIsLoggedInAndGetsToken

------------------------------------------------------------------------

### T3 --- Exception Case

The exception case handles deviations from normal workflows.

Characteristics:

-   Error handling scenarios
-   System recovery paths
-   Unexpected but valid system states

Example:

T3_login_validUserWithNotReadableIdCard_userGetErrormessageAndIsNotLoggedIN

------------------------------------------------------------------------

### T4 --- Negative Case

The negative case verifies that the system correctly rejects invalid
inputs.

Characteristics:

-   Invalid data
-   Invalid user actions
-   Same interaction flow as positive cases but incorrect inputs

Example:

T4_login_validUserWithWrongPassword_userGetErrormessageAndIsNotLoggedIN

------------------------------------------------------------------------

### T5 --- Misuse Case

The misuse case tests system robustness and security.

Characteristics:

-   Attempts to manipulate the system
-   Unexpected interactions
-   Resilience testing

Example:

T5_login_validUserWithLockedIdCard_userGetErrormessageAndIsNotLoggedIN

------------------------------------------------------------------------

## Test Scenario Naming Syntax

The T1T5 method defines a structured naming convention for test
scenarios.

### Syntax

`<Tx>`{=html}*`<Feature>`{=html}*\<BusinessRule\|Requirement\>\_`<Expected_Result>`{=html}

Example:

T1_login_validUserWithCorrectPassword_userIsLoggedInAndGetsToken

------------------------------------------------------------------------

## Principles of T1T5 Test Naming

### 1. Express a Specific Requirement

Each test should represent a clear requirement derived from:

-   Business requirements
-   Technical requirements

If a test does not represent a requirement, its value should be
questioned.

------------------------------------------------------------------------

### 2. Include Input and Expected Result

A test name should describe:

-   The input or state
-   The expected outcome

Example:

validUserWithWrongPassword → error message

------------------------------------------------------------------------
 
### 3. Be Readable as a Statement

Test names should be written as clear declarative statements describing
workflows and outcomes.

Tests should serve as documentation of system behavior.

------------------------------------------------------------------------

## Example Scenario: Login Feature

Feature:

A user with valid credentials (username and password) can log in to the
application.

Example test scenarios:

T1_login_validUserWithCorrectPassword_userIsLoggedInAndGetsToken\
T2_login_validUserWithValidIdCard_userIsLoggedInAndGetsToken\
T3_login_validUserWithNotReadableIdCard_userGetErrormessageAndIsNotLoggedIN\
T4_login_validUserWithWrongPassword_userGetErrormessageAndIsNotLoggedIN\
T5_login_validUserWithLockedIdCard_userGetErrormessageAndIsNotLoggedIN

------------------------------------------------------------------------

## Benefits of the T1T5 Approach

-   Clear coverage of positive and negative scenarios
-   Strong focus on user workflows
-   Tests act as living documentation
-   Easy identification of missing test coverage
-   Faster understanding of failing scenarios

By structuring tests into these five categories, teams achieve
systematic scenario coverage while maintaining readability and
traceability.