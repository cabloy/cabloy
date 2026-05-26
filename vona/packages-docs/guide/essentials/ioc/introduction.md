# Introduction

We know that `IOC`(Inversion of Control) is an effective architectural design for system decoupling, and is also a supporting tool for the development of large-scale business systems.

## IOC Containers

There are two types of ioc containers in Vona:

1. `app container`: During system initialization, a unique global bean container will be automatically created. Bean instances created in this container are all singleton mode
2. `ctx container`: When requests coming, the system will create a bean container for each of them

## Bean Class

Vona adopts a modular system, and Bean Classes are provided by different modules.

## Injection Scope

Vona provides the following injection scopes:

1. `app`: Inject in the app container
2. `ctx`: Inject in the ctx container
3. `new`: Always create a new bean instance

## Injection method

Vona provides two injection methods:

1. `Dependency injection`: Provides attribute-based dependency injection through the `@Use` decorator
2. `Dependency lookup`: Directly lookup the required bean instance through the ioc container, and automatically create it if it does not exist
