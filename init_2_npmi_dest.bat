@echo off
REM SETLOCAL EnableDelayedExpansion

cd %~dp0

REM echo f | xcopy /y %~dp0src\jscore\core\package.json %~dp0dest\jscore\core\package.json
REM CD %~dp0dest\jscore\core
REM CALL npm i
REM echo %%%%%%%%

echo f | xcopy %~dp0src\jscore\jssn\package.json %~dp0dest\jscore\jssn\package.json
CD %~dp0dest\jscore\jssn
CALL npm i
echo ========

echo f | xcopy %~dp0src\jscore\db\package.json %~dp0dest\jscore\db\package.json
CD %~dp0dest\jscore\db
CALL npm i
echo ========

echo f | xcopy %~dp0src\jscore\func\package.json %~dp0dest\jscore\func\package.json
CD %~dp0dest\jscore\func
CALL npm i
echo ========

REM echo f | xcopy %~dp0src\jscore\dev\package.json %~dp0dest\jscore\dev\package.json
REM CD %~dp0dest\jscore\dev
REM CALL npm i
REM echo ========

CD %~dp0
