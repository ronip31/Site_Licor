import uuid
import hashlib

def generate_session_id(user_agent, screen_info, language, time_zone, fingerprint):
    # Combina as informações do cliente e do navegador em uma string
    string_to_hash = f"{user_agent}-{screen_info}-{time_zone}-{fingerprint}"
    print("string_to_hash", fingerprint)
    
    # Usa SHA-256 para gerar um hash da string combinada
    sha256_hash = hashlib.sha256(string_to_hash.encode('utf-8')).hexdigest()
    
    # Usa o hash SHA-256 como base para gerar um UUID v5
    NAMESPACE = uuid.UUID('4a02c9d0-9d62-11ec-b909-0242ac120002')  # Namespace estático
    session_id = uuid.uuid5(NAMESPACE, sha256_hash)
    
    return str(session_id)