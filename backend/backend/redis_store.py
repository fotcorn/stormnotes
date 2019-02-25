import redis
from django.conf import settings


class RedisStore(object):

    def __init__(self):
        host, port = settings.REDIS_URL.netloc.split(':')
        self.r = redis.StrictRedis(host=host, port=port, db=0)

    def init(self):
        self.r.set('pages_pk_counter', 0)

    def get_tree(self, username):
        return self.r.hgetall('tree:{}'.format(username)).keys()

    def get_page(self, username, page):
        page_pk = self.r.hget('tree:{}'.format(username), page)
        if not page_pk:
            return None
        return self.r.get('pages:{}'.format(int(page_pk)))

    def set_page(self, username, page, content):
        page_pk = self.r.hget('tree:{}'.format(username), page)
        if not page_pk:
            page_pk = int(self.r.incr('pages_pk_counter'))
            self.r.hset('tree:{}'.format(username), page, page_pk)
        self.r.set('pages:{}'.format(int(page_pk)), content)


"""
set pages:1 "# chapter 1"
set pages:2 " #chapter 3"

set pages_pk_counter 2

hmset tree:admin index 1 overview 2
"""
