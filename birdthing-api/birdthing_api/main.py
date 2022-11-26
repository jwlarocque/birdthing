from starlite import Starlite

from controllers.bird import BirdController
from birdthing_api.db import sqla_plugin


app = Starlite(route_handlers=[BirdController], plugins=[sqla_plugin])