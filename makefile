.PHONY: all example test fmt lint

FLAGS=--unstable --config deno.json
PERMS=--allow-hrtime --allow-env

.ONESHELL:
example:
	@start=$$(date +%s%N);
	LOG_LEVEL=DEBUG deno run ${FLAGS} ${PERMS} example/main.ts;
	end=$$(date +%s%N);
	printf "Execution time: %sms\n" $$( echo "scale = 10; ($$end - $$start) / 1000000" | bc -l );

test:
	LOG_LEVEL=ERROR deno test ${FLAGS} ${PERMS} .

fmt:
	deno fmt ${FLAGS} .

lint:
	deno lint ${FLAGS} .