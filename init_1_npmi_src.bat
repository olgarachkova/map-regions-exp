@echo off
REM SETLOCAL EnableDelayedExpansion

CD %~dp0

rmdir node_modules /s/q
CALL npm i
echo ========

REM CD %~dp0src\jscore\core
REM rmdir node_modules /s/q
REM CALL npm i
REM echo ========

CD %~dp0src\jscore\jssn
rmdir node_modules /s/q
CALL npm i
echo ========

CD %~dp0src\jscore\db
rmdir node_modules /s/q
CALL npm i
echo ========

CD %~dp0src\jscore\func
rmdir node_modules /s/q
CALL npm i
echo ========

REM CD %~dp0src\jscore\dev
REM rmdir node_modules /s/q
REM CALL npm i
REM echo ========