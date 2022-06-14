@echo off
REM SETLOCAL EnableDelayedExpansion

cd %~dp0

SET dirBase=%~dp0\src\back\
SET dstFile=%dirBase%\ignoreVCS\ignoreCfg.ts
SET srcFile=%dirBase%\local\ignoreCfg.ts

IF NOT EXIST "%dstFile%" (
     copy "%srcFile%" "%dstFile%"
)

CALL init_1_npmi_src.bat

cd %~dp0

rmdir dst /s/q
REM CALL npm run build
REM Errors are expected at this stage!!

CALL init_2_npmi_dst.bat

cd %~dp0

CALL init_3_helpers.bat

CALL npm run build
REM Here must be successful

REM CALL npm test