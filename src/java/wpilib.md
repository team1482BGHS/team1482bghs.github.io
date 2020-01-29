---
layout: doc.njk
title: WPILib
tags: java
---
# {{ title }}

WPILib is the main offical FRC library (a library is some external code that leverages code for subcomponents). It's maintained by FIRST and is used in every supported programming language (Java, C++ and Python with pyfrc).
It contains the bulk of the supporting code that __runs on the robot__, including
- operating motors
- reading values from sensors such as
  - encoders, which detect the rotational position of a axel
  - proximity sensors, which detect the distance to the closest object
  - color sensors and cameras 
- reading inputs from the controlling machine such as
  - connected controllers
  - paramaters chosen from a dashboard

The code runs on the robot and remotely connects via wifi to DriverStation, which relays remote inputs to the robot.

## Third-party libraries
As of 2019, parts of WPILib have been split into third-party libraries, which are separate and not included in the official install. Vendor-specific (third-parties are referred to as vendors) components, such as TalonSXR from CTR electronics or Sparks from Rev robotics are now required to be separately installed in addition to WPILib. The build script should automatically push the libraries to the RoboRIO the first time it is ran.

In addition to that third-party libraries also have a local configuration client which is used to setup device ids and other parameters. Configurations are saved in [non-volatile memory](https://en.wikipedia.org/wiki/Non-volatile_memory) and only have to be configured once.

## Program Structure
All robot projects follow roughly a preset superclass and they override methods to provide functionality.

### [TimedRobot](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/TimedRobot.html)
A TimerRobot class is ran on a loop which periodically calls methods on a tight loop (~20 milliseconds).


### [CommandRobot](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/CommandRobot.html)

```java
import edu.wpi.first.wpilibj.TimedRobot;
import edu.wpi.first.wpilibj.CommandRobot;
```


## Motor Controllers & Motors
WPILib has two separate concepts which controlling motors: motor controllers and drive configurations.

### Motor Controllers
A motor controller is physically identical to a talon. Aside from motor controllers connected via PWM or digital inputs, all other motor controllers are provided by third-party libraries. Controllers are indexed by integer identifiers which are configured in advance by the client.

```java
// Spark controllers
import com.revrobotics.CANSparkMax;
import com.revrobotics.CANSparkMaxLowLevel.MotorType;
new CANSparkMax(0, MotorType.kBrushless);

// TalonSRX
import com.ctre.phoenix.motorcontrol.can.WPI_TalonSRX;
new WPI_TalonSRX(0);
```

### Drive Configurations
All drive configurations take in motor controllers as a parameters, and drive them simultaneously.
- **[DifferentialDrive](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/drive/DifferentialDrive.html)** is a 2 motor standard drive for belts, chains and standalone wheels. It can be extended to any amount of motors on each side using **[SpeedControllerGroups](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/SpeedControllerGroup.html)**.
- **[MecanumDrive](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/drive/MecanumDrive.html)** is a 4 motor drive where all wheels are [mecanum wheels](https://en.wikipedia.org/wiki/Mecanum_wheel).
- **[KilloughDrive](https://first.wpi.edu/FRC/roborio/beta/docs/java/edu/wpi/first/wpilibj/drive/KilloughDrive.html)** is a [3 motor drive](https://en.wikipedia.org/wiki/Killough_platform) where all wheels are 60&deg; apart.

```java
// DifferentialDrive
import edu.wpi.first.wpilibj.drive.DifferentialDrive;
new DifferentialDrive(motorShooterLeft, motorShooterLeft);

// DifferentialDrive with SpeedControllerGroups (more than 2 motors)
import edu.wpi.first.wpilibj.MecanumDrive;
new MecanumDrive(
  new SpeedControllerGroup(motorFrontLeft, motorRearLeft),
  new SpeedControllerGroup(motorFrontRight, motorRearRight)
);

// DifferentialDrive with SpeedControllerGroups (more than 2 motors)
import edu.wpi.first.wpilibj.MecanumDrive;
new MecanumDrive(frontLeftMotor, rearLeftMotor, frontRightMotor, rearRightMotor);

// KilloughDrive
import edu.wpi.first.wpilibj.KilloughDrive;
new KilloughDrive(motorLeft, motorRight, motorBack);
```


