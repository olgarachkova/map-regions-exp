@echo off
REM SETLOCAL EnableDelayedExpansion

cd %~dp0

echo f | xcopy %~dp0src\jscore\jssn\package.json %~dp0dst\jscore\jssn\package.json
CD %~dp0dst\jscore\jssn
CALL npm i
echo ========

echo f | xcopy %~dp0src\jscore\db\package.json %~dp0dst\jscore\db\package.json
CD %~dp0dst\jscore\db
CALL npm i
echo ========

echo f | xcopy %~dp0src\jscore\func\package.json %~dp0dst\jscore\func\package.json
CD %~dp0dst\jscore\func
CALL npm i
echo ========

CD %~dp0
