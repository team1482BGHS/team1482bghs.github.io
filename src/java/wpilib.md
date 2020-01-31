---
layout: doc.njk
title: WPILib
tags: java
---

# {{ title }}

WPILib is the main official FRC library (a library is some external code that leverages code for subcomponents). It's maintained by FIRST and is used in every supported programming language (Java, C++ and Python with [pyfrc](https://pypi.org/project/pyfrc/)).

It contains the bulk of the supporting code that runs on the robot, including

- operating motors
- reading values from sensors such as
  - encoders, which detect the rotational position of a axel
  - proximity sensors, which detect the distance to the closest object
  - color sensors and cameras
- reading inputs from the controlling machine such as
  - connected controllers
  - parameters chosen from a dashboard

The code runs on the robot and remotely connects via wifi to DriverStation, which relays remote inputs to the robot.

## Third-party libraries

As of 2019, parts of WPILib have been split into third-party libraries, which are separate and not included in the official install. Vendor-specific (third-parties are sometimes referred to as vendors) components, such as TalonSXR from CTR electronics or Sparks from Rev robotics are now required to be separately installed in addition to WPILib. Once installed, it is required to enable them in VSCode by using the option `WPILib: Manage vendor libraries` within the command palette (the F1 menu). The build script should automatically push the libraries to the RoboRIO the first time it is ran.

In addition to that third-party libraries also have a local configuration client which is used to setup device ids and other parameters. Configurations are saved in [non-volatile memory](https://en.wikipedia.org/wiki/Non-volatile_memory) and only have to be configured once.

## Program Structure

All robot projects follow roughly a preset superclass and they override methods to provide functionality.

### Time Based

A [TimedRobot](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/TimedRobot.html) periodically calls methods on a tight loop (~20 milliseconds).
Available overridable methods:

- `public void robotInit()` is the first method ran and is intended for robot initialization code. It is guaranteed that motor controllers and other devices are ready when this is called.
- `public void autonomousInit()` is ran before `autonomousPeriodic()` and is intended for autonomous initialization code (if any). Optional.
- `public void autonomousPeriodic()` is code ran on a loop during the 15 second autonomous period.
- `public void teleopInit()` is ran before `teleopPeriodic()` and is intended for tele-operated initialization code (if any). Optional.
- `public void teleopPeriodic()` is code ran on a loop during the 195 second tele-operated period.
- `public void testInit()` is ran before `testPeriodic()` and is intended for any testing initialization code (if any). *It will never be ran during official competitions.* Optional.
- `public void teleopPeriodic()` is code ran on a loop during the 195 second tele-operated period. *It will never be ran during official competitions.* Optional.

```java
import com.revrobotics.CANSparkMax;
import com.revrobotics.CANSparkMaxLowLevel.MotorType;

import edu.wpi.first.wpilibj.TimedRobot;
import edu.wpi.first.wpilibj.Joystick;
import edu.wpi.first.wpilibj.drive.DifferentialDrive;

public class Robot extends TimedRobot {
  // Member variables go here
  DifferentialDrive drive;
  Joystick joy;

  @Override
  public void robotInit() {
    // Initilize the member variables here
    var motorLeft = new CANSparkMax(0, MotorType.kBrushless);
    var motorRight = new CANSparkMax(1, MotorType.kBrushless);

    drive = new DifferentialDrive(motorLeft, motorRight);
    joy = new Joystick(0);
  }

  @Override
  public void autonomousPeriodic() {
    // Enable motors to run during the peroid
    // Consider using a Timer to keep track of the game time
    drive.arcadeDrive(0.2, 0.0);  // Drive forward at 20% speed for the full 15 seconds of autonomous
  }

  @Override
  public void teleopPeriodic() {
    // Gather remote input (controllers, dashboard, etc.)
    // Enable motors to run during the peroid
    drive.arcadeDrive(joy.getY(), joy.getX());  // Use controller inputs to drive the robot with the left joystick
  }
}
```

### Command Based

[CommandRobot](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/CommandRobot.html) is a alternate method of binding inputs to actions. I have zero experience with this so you're on your own. Good luck!

## Motor Controllers & Motors

WPILib has two separate concepts which controlling motors: motor controllers and drive configurations.

### Motor Controllers

A motor controller is physically identical to a talon. Aside from motor controllers connected via PWM or digital inputs, all other motor controllers are provided by third-party libraries. Controllers are indexed by integer identifiers which are configured in advance by the client.

Any individual motor controller can be inverted with the method `setInverted(bool invert)` and can be individually ran with `set(double speed)`. For `set`, forwards is positive. These methods also work on all vendor motor controllers. Note that motor controllers can usually be inverted and sometimes manually ran within the client.

There is a [watchdog](https://en.wikipedia.org/wiki/Watchdog_timer) automatically running on *all* motor controllers. **If the motor controller has not been updated within the past loop it might be reset by the watchdog and the motor will stall. Ensure that the periodic methods send a output to every motor controller *every* loop.**

```java
// Spark controllers
import com.revrobotics.CANSparkMax;
import com.revrobotics.CANSparkMaxLowLevel.MotorType;

var motor = new CANSparkMax(0, MotorType.kBrushless);
motor.setInverted(true); // Motor is now inverted
motor.set(0.5); // Run at half speed


// TalonSRX
import com.ctre.phoenix.motorcontrol.can.WPI_TalonSRX;

var motor = new WPI_TalonSRX(0);
motor.setInverted(false);  // Motor is not inverted
motor.set(-1.0);  // Run in reverse at full speed
```

### Drive Configurations

All drive configurations take in motor controllers as a parameters, and drive them simultaneously.

#### DifferentialDrive

[DifferentialDrive](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/drive/DifferentialDrive.html) is a 2 motor standard drive for belts, chains and standalone wheels. It's constructor takes in two motor controllers for each side: `DifferentialDrive(SpeedController left, SpeedController right)`.

It can be extended to any amount of motors on each side for 4/6/8 wheel drives using double [SpeedControllerGroups](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/SpeedControllerGroup.html). The SpeedControllerGroups are considered to be a SpeedController and therefore are valid for the constructor.

The setup is mainly driven with the `arcadeDrive(double x, double y)` method. For `x`, forward is positive, and for `y` clockwise is positive.

```java
// DifferentialDrive with 2 motors
import edu.wpi.first.wpilibj.drive.DifferentialDrive;

var drive = new DifferentialDrive(motorShooterLeft, motorShooterLeft);
drive.arcadeDrive(1.0, 0.0);  // Run full speed forward


// DifferentialDrive with SpeedControllerGroups (more than 2 motors)
import edu.wpi.first.wpilibj.drive.DifferentialDrive;

var drive = new DifferentialDrive(
  new SpeedControllerGroup(motorFrontLeft, motorRearLeft),
  new SpeedControllerGroup(motorFrontRight, motorRearRight)
);
drive.arcadeDrive(0.0, -1.0);  // Turn entire robot counter-clockwise (left) at full speed
```

#### MecanumDrive

[MecanumDrive](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/drive/MecanumDrive.html) is a 4 motor drive where all wheels are [mecanum wheels](https://en.wikipedia.org/wiki/Mecanum_wheel).

The setup is driven with the `driveCartesian(double y, double x, double z)` method. For `y` right is positive, for `x` forward is positive, and for `z` clockwise is positive. `y` is the strafing controls, while `x` and `z` control just like `DifferentialDrive.arcadeDrive`.

```java
// MecanumDrive with 4 motors
import edu.wpi.first.wpilibj.MecanumDrive;

var drive = new MecanumDrive(frontLeftMotor, rearLeftMotor, frontRightMotor, rearRightMotor);
drive.driveCartesian(1.0, -1.0, 0.0);  // Move the entire robot in the south-east direction at full speed
drive.driveCartesian(0.0, 0.0, 1.0);  // Turn entire robot clockwise (right) at full speed
```

#### KilloughDrive

[KilloughDrive](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/drive/KilloughDrive.html) is a [3 motor drive](https://en.wikipedia.org/wiki/Killough_platform) where all wheels are 60&deg; apart. This drive mechanism is not really practical for competition use, so it's not documented here in full. Check out the [documentation for info](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/drive/KilloughDrive.html).

## Joysticks

[Joysticks](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/Joystick.html) are the main method of receiving input from the remote laptop. Contrary to it's name, it physically corresponds to a controller. Each controller plugged into DriverStation has a identifier number, so the first plugged in will be 0, the second 1, etc. It works across all brands of controllers that DriverStation supports.

Inputs can be grabbed with `double getX()` and `double getY()` for the left joystick only.

```java
import edu.wpi.first.wpilibj.Joystick;

var joy = new Joystick(0);
var y = joy.getY();  // Gets the y axis as a double ranging from -1.0 to 1.0
var x = joy.getX();
```

All other controller inputs can be fetched with `double getRawAxis(int axis)` or `bool getRawButton(int button)`. The axis number are labeled in DriverStation starting from 0, and the buttons are ordered in DriverStation starting from 1. For convenience, they are listed here:

Id | Axis label
-  | ----
0  | Left X axis
1  | Left Y axis
2  | L Trigger
3  | R Trigger
4  | Right X axis
5  | Right Y axis

Id | Button label
-  | ----
1  | A button
2  | B button
3  | X button
4  | Y button
5  | Left bumper
6  | Right bumper
7  | Back/select button
8  | Start button
9  | Left axis button
10 | Right axis button

```java
import edu.wpi.first.wpilibj.Joystick;

// Defining constants at the start of your file is a good idea so values are all in one easy to access place
static final int buttonA = 1;
static final int buttonY = 4;
static final int axisX = 0;
static final int triggerR = 3;

var stick = new Joystick(0);

var isAPressed = joy.getRawButton(buttonA);  // Whether or not the A button is pressed
var isYPressed = joy.getRawButton(buttonY);
var isLBPressed = joy.getRawButton(6);  // Also works with raw values

var x = joy.getRawAxis(axisX);  // Gets the position of the X axis. Returns a double ranging from -1.0 to 1.0 for axises. Functions identical to joy.getX().
var r = joy.getRawAxis(triggerR);  // Returns a double ranging from 0.0 to 1.0 for triggers.
```

## Pneumatics

Pneumatic systems on the robot interact in a much simpler way in contrast to most other systems. Generally, there is only 2 electrical components: the compressor and and [solenoids](https://en.wikipedia.org/wiki/Solenoid_valve).

The compressor is operated automatically whenever the robot is enabled by default, although this behavior can be changed. Using the [Compressor](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/Compressor.html) class, we can manually `start()` and `stop()` it when necessary. This behavior is desirable for during PR events, or in a silent environment.

[Solenoids](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/Solenoid.html) are operated similar to motor controllers: they are initialized using a identifier and are operated using simple methods. Solenoids will remember their state between loops, and do not have a running watchdog. To change the state of a solenoid, call the method `set(boolean enable)`.

## Servos

## Sensors

### Encoders

### Digital Sensors

## External Boards
