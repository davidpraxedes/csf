#!/usr/bin/env python3
"""
Script para consultar CPF via API
ATENÇÃO: Use apenas com autorização e para fins legítimos
"""

import requests
import json
import sys
import re

# Credenciais da API
SUPABASE_URL = "https://tsmbotzygympsfxvjeul.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzbWJvdHp5Z3ltcHNmeHZqZXVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5Njg3NzMsImV4cCI6MjA4MjU0NDc3M30.W4AbPD6W1hksp0ZcM0-BG9c3aixIk5RejNxQrusV3M0"

def limpar_cpf(cpf):
    """Remove formatação do CPF"""
    return re.sub(r'\D', '', cpf)

def validar_cpf(cpf):
    """Validação básica de CPF"""
    cpf_limpo = limpar_cpf(cpf)
    if len(cpf_limpo) != 11:
        return False, "CPF deve conter 11 dígitos"
    
    # Verifica se todos os dígitos são iguais
    if cpf_limpo == cpf_limpo[0] * 11:
        return False, "CPF inválido (todos os dígitos iguais)"
    
    return True, cpf_limpo

def formatar_cpf(cpf):
    """Formata CPF com pontos e traço"""
    cpf_limpo = limpar_cpf(cpf)
    if len(cpf_limpo) == 11:
        return f"{cpf_limpo[:3]}.{cpf_limpo[3:6]}.{cpf_limpo[6:9]}-{cpf_limpo[9:]}"
    return cpf

def consultar_cpf(cpf):
    """Consulta CPF na API"""
    valid, resultado = validar_cpf(cpf)
    
    if not valid:
        return {
            "erro": True,
            "mensagem": resultado
        }
    
    cpf_limpo = resultado
    url = f"{SUPABASE_URL}/functions/v1/consulta-cpf"
    
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}"
    }
    
    payload = {
        "cpf": cpf_limpo
    }
    
    try:
        print(f"🔍 Consultando CPF: {formatar_cpf(cpf_limpo)} ({cpf_limpo})")
        print(f"📡 URL: {url}")
        print("⏳ Aguardando resposta...")
        
        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        print(f"📊 Status: {response.status_code} {response.reason}")
        
        try:
            data = response.json()
        except json.JSONDecodeError:
            data = {"raw_response": response.text[:500]}  # Limita tamanho
        
        if response.status_code == 200:
            # Processa os dados como o site faz
            resultado_processado = {
                "nome_completo": data.get("nomeCompleto", ""),
                "nome_mae": data.get("nomeDaMae") or data.get("nomeMae", ""),
                "data_nascimento": data.get("dataDeNascimento") or data.get("dataNascimento", ""),
                "email": data.get("emails", [{}])[0].get("enderecoEmail", "") if data.get("emails") else "",
                "endereco": data.get("enderecos", [None])[0] if data.get("enderecos") else None,
                "dados_completos": data
            }
            
            return {
                "erro": False,
                "status": response.status_code,
                "dados": resultado_processado
            }
        else:
            return {
                "erro": True,
                "status": response.status_code,
                "mensagem": data.get("error", data.get("message", response.reason)),
                "dados": data
            }
            
    except requests.exceptions.Timeout:
        return {
            "erro": True,
            "mensagem": "Tempo de espera esgotado. Verifique sua conexão com a internet ou tente novamente mais tarde."
        }
    except requests.exceptions.ConnectionError as e:
        return {
            "erro": True,
            "mensagem": f"Erro de conexão: Não foi possível conectar ao servidor. Verifique sua internet ou se há bloqueio de firewall/VPN. Detalhes: {str(e)[:200]}"
        }
    except requests.exceptions.RequestException as e:
        return {
            "erro": True,
            "mensagem": f"Erro na requisição: {str(e)[:200]}"
        }
    except Exception as e:
        return {
            "erro": True,
            "mensagem": f"Erro inesperado: {str(e)[:200]}"
        }

def main():
    if len(sys.argv) > 1:
        cpf = sys.argv[1]
    else:
        cpf = input("Digite o CPF (apenas números ou com formatação): ").strip()
    
    if not cpf:
        print("❌ CPF não fornecido")
        sys.exit(1)
    
    resultado = consultar_cpf(cpf)
    
    print("\n" + "="*60)
    print("RESULTADO DA CONSULTA")
    print("="*60)
    
    if resultado.get("erro"):
        print("❌ Erro na consulta:")
        print(f"   Status: {resultado.get('status', 'N/A')}")
        print(f"   Mensagem: {resultado.get('mensagem', 'Erro desconhecido')}")
        if resultado.get("dados"):
            print(f"\n   Detalhes: {json.dumps(resultado['dados'], indent=2, ensure_ascii=False)}")
    else:
        dados = resultado.get("dados", {})
        print("✅ Consulta realizada com sucesso!\n")
        print("📋 Dados encontrados:")
        print("-"*60)
        print(f"   Nome Completo: {dados.get('nome_completo') or '(não encontrado)'}")
        print(f"   Nome da Mãe: {dados.get('nome_mae') or '(não encontrado)'}")
        print(f"   Data de Nascimento: {dados.get('data_nascimento') or '(não encontrado)'}")
        print(f"   Email: {dados.get('email') or '(não encontrado)'}")
        if dados.get("endereco"):
            print(f"   Endereço: {json.dumps(dados['endereco'], indent=4, ensure_ascii=False)}")
        print("-"*60)
        
        if dados.get("dados_completos"):
            print("\n📦 Dados completos (JSON):")
            print(json.dumps(dados["dados_completos"], indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()

