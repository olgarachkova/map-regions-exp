@echo off
REM SETLOCAL EnableDelayedExpansion

cd %~dp0

CALL init_01_pull.bat

cd %~dp0

CALL init_base.bat