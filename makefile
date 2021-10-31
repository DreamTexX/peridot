.PHONY: all example test fmt lint

FLAGS=--unstable --config deno.json
PERMS=--allow-hrtime --allow-env

example:
	export LOG_LEVEL=INFO; deno run ${FLAGS} ${PERMS} example/main.ts

test:
	export LOG_LEVEL=OFF; deno test ${FLAGS} ${PERMS} .

fmt:
	deno fmt ${FLAGS} .

lint:
	deno lint ${FLAGS} .