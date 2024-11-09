from django.http import HttpResponse


def index(request) -> HttpResponse:
    return HttpResponse(
        "Hello, world. Let us help you with parking on your college campus."
    )
