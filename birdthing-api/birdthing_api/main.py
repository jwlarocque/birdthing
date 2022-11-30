import uvicorn

from starlite import Starlite

from birdthing_api.controllers.bird import BirdController
from birdthing_api.db import sqla_plugin


# config = {}
# config["log_config"] = {"version": 1, "disable_existing_loggers": False}

app = Starlite(route_handlers=[BirdController], plugins=[sqla_plugin], debug=True)

# if __name__ == "__main__":
#     uvicorn.run("birdthing_api.main:app", reload=True, **config)

