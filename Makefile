start: stop
	nohup python -m SimpleHTTPServer &
	compass watch web

stop:
	python stop.py
	rm -f nohup.out