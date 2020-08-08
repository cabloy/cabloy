#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

cmdname=$(basename $0)

echoerr() { if [[ $QUIET -ne 1 ]]; then echo "$@" 1>&2; fi }

usage() {
    cat << USAGE >&2
Usage:
    $cmdname host:port [-s] [-t timeout] [-- command args]
    -s | --strict               Only execute subcommand if the test succeeds
    -q | --quiet                Don't output any status messages
    -t TIMEOUT | --timeout=TIMEOUT
                                Timeout in seconds, zero for no timeout
    -- COMMAND ARGS             Execute command with args after the test finishes
USAGE
    exit 1
}

wait_for() {
    local wait_host=$1
    local wait_port=$2
    if [[ $TIMEOUT -gt 0 ]]; then
        echoerr "$cmdname: waiting $TIMEOUT seconds for $wait_host:$wait_port"
    else
        echoerr "$cmdname: waiting for $wait_host:$wait_port without a timeout"
    fi
    local start_ts=$(date +%s)
    while :
    do
        (echo > /dev/tcp/$wait_host/$wait_port) >/dev/null 2>&1
        local result=$?
        if [[ $result -eq 0 ]]; then
            local end_ts=$(date +%s)
            echoerr "$cmdname: $wait_host:$wait_port is available after $((end_ts - start_ts)) seconds"
            break
        fi
        sleep 1
    done
    return $result
}

wait_for_wrapper() {
    local wait_host=$1
    local wait_port=$2
    # In order to support SIGINT during timeout: http://unix.stackexchange.com/a/57692
    if [[ $QUIET -eq 1 ]]; then
        timeout $TIMEOUT $0 $wait_host:$wait_port --quiet --child --timeout=$TIMEOUT &
    else
        timeout $TIMEOUT $0 $wait_host:$wait_port --child --timeout=$TIMEOUT &
    fi
    PID=$!
    trap "kill -INT -$PID" INT
    wait $PID
    RESULT=$?
    if [[ $RESULT -ne 0 ]]; then
        echoerr "$cmdname: timeout occurred after waiting $TIMEOUT seconds for $wait_host:$wait_port"
    fi
    return $RESULT
}

parse_arguments() {
  local index=0
  while [[ $# -gt 0 ]]
  do
      case "$1" in
          *:* )
          hostport=(${1//:/ })
          HOST[$index]=${hostport[0]}
          PORT[$index]=${hostport[1]}
          shift 1
          ;;
          --child)
          CHILD=1
          shift 1
          ;;
          -q | --quiet)
          QUIET=1
          shift 1
          ;;
          -s | --strict)
          STRICT=1
          shift 1
          ;;
          -t)
          TIMEOUT="$2"
          if [[ $TIMEOUT == "" ]]; then break; fi
          shift 2
          ;;
          --timeout=*)
          TIMEOUT="${1#*=}"
          shift 1
          ;;
          --)
          shift
          CLI="$@"
          break
          ;;
          --help)
          usage
          ;;
          *)
          echoerr "Unknown argument: $1"
          usage
          ;;
      esac
      let index+=1
  done
  if [[ ${#HOST[@]} -eq 0 || ${#PORT[@]} -eq 0 ]]; then
      echoerr "Error: you need to provide a host and port to test."
      usage
  fi
}

iterate_hosts() {
  local result=0
  local index=0
  local wait_function=$1
  while [[ $result -eq 0 && $index -lt ${#HOST[@]} ]]; do
    ($wait_function ${HOST[$index]} ${PORT[$index]})
    result=$?
    let index+=1
  done
  echo $result
}

wait_for_services() {
  TIMEOUT=${TIMEOUT:-15}
  STRICT=${STRICT:-0}
  CHILD=${CHILD:-0}
  QUIET=${QUIET:-0}

  if [[ $CHILD -gt 0 ]]; then
      exit $(iterate_hosts wait_for)
  else
      if [[ $TIMEOUT -gt 0 ]]; then
          RESULT=$(iterate_hosts wait_for_wrapper)
      else
          RESULT=$(iterate_hosts wait_for)
      fi
  fi
}

parse_arguments "$@"
wait_for_services

if [[ $CLI != "" ]]; then
    if [[ $RESULT -ne 0 && $STRICT -eq 1 ]]; then
        echoerr "$cmdname: strict mode, refusing to execute subprocess"
        exit $RESULT
    fi
    exec $CLI
else
    exit $RESULT
fi
