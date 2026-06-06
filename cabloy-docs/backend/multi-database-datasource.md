# Multi-Database and Datasource Guide

This guide explains how multi-database and multi-datasource support works in Vona within the Cabloy monorepo.

## Why this matters

Vona ORM is designed for business systems that may need:

- multiple database engines
- multiple datasources
- cross-datasource relation queries

This is an important part of the framework’s large-system positioning.

## Core model

A representative example uses related models such as `User` and `Order`.

The key idea is that model relations can remain meaningful even when the participating data lives on different datasources.

## Datasource setup

Three important pieces define the datasource setup:

1. datasource type definitions
2. datasource configuration in app config
3. model or relation-level selection of which datasource to use

That means datasource choice is part of the typed application model, not just a hidden runtime string.

## Dynamic datasource selection

One pattern is to create a model instance bound to a chosen datasource dynamically.

This is useful when the decision depends on runtime context.

## Relation-level datasource selection

Relation options can also specify datasource metadata.

That matters because different parts of a related object graph may need different datasource bindings.

## Model-level and app-config-level defaults

You can also simplify usage by declaring datasource choices in:

- model options
- app config

That reduces repeated dynamic selection in ordinary business code.

## Why this matters for AI workflows

When AI changes backend data flow in a multi-datasource system, it should ask:

1. is the model using the default datasource or a specific one?
2. do related models need different datasource bindings?
3. should the datasource choice live in runtime logic, relation metadata, model metadata, or app config?
4. does the transaction or cache path need to match the same datasource choice?

That keeps multi-datasource logic coherent instead of fragile.
