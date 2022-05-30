@echo off
REM SETLOCAL EnableDelayedExpansion

git pull
echo ========

REM CD %~dp0src\jscore\core
REM git pull
REM echo ========

CD %~dp0src\jscore\jssn
git pull
echo ========

CD %~dp0src\jscore\db
git pull
echo ========

CD %~dp0src\jscore\func
git pull
echo ========

REM CD %~dp0src\jscore\dev
REM git pull
REM echo ========

