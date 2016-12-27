-include ./.env
include ./.env.default

BIN_DIR ?= ./node_modules/.bin

help:
	@echo
	@echo "  \033[34mdev-server\033[0m  start dev server"
	@echo "  \033[34mmocha\033[0m       run tests with mocha"


dev-server:
	@nodemon | bunyan

dist: export NODE_ENV = test
dist:
	@mocha

.PHONY: help dev-server frontend start dist
