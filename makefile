.PHONY: all example test fmt lint

FLAGS=--unstable --config deno.json
PERMS=--allow-hrtime --allow-env

test:
	LOG_LEVEL=ERROR deno test ${FLAGS} ${PERMS} .

fmt:
	deno fmt ${FLAGS} .

lint:
	deno lint ${FLAGS} .

bench:
	LOG_LEVEL=OFF deno run ${FLAGS} ${PERMS} benchmark.ts