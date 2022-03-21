@echo off
REM SETLOCAL EnableDelayedExpansion

cd %~dp0

SET dirBase=%~dp0\src\back\
SET destFile=%dirBase%\ignoreVCS\ignoreCfg.ts
SET srcFile=%dirBase%\local\ignoreCfg.ts

@REM IF NOT EXIST "%destFile%" (
@REM     copy "%srcFile%" "%destFile%"
@REM )

CALL init_1_npmi_src.bat

cd %~dp0

rmdir dest /s/q
CALL npm run build
REM Errors are expected at this stage!!

CALL init_2_npmi_dest.bat

cd %~dp0

CALL init_3_helpers.bat

CALL npm run build
REM Here must be successful

CALL npm test