from django.http import JsonResponse
from ..services import generate_session_id

def generate_session_id_view(request):
    user_agent = request.META.get('HTTP_USER_AGENT', '')
    screen_info = request.GET.get('screen_info', '')
    language = request.GET.get('language', '')
    time_zone = request.GET.get('time_zone', '')

    # Gera o session_id utilizando a função do utils
    session_id = generate_session_id(user_agent, screen_info, language, time_zone)

    # Retorna o session_id gerado para o frontend
    return JsonResponse({"session_id": session_id})
