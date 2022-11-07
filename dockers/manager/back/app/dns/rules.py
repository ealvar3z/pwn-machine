from app.api import get_powerdns_http_api as dns_http
from app.utils import (
    create_node_id,
    createType,
    registerMutation,
    registerQuery,
)
from app.exception import PMException


def escape_lua(lua):
    lua = lua.replace("\\", "\\x5c")
    lua = lua.replace('"', "\\x22")
    lua = lua.replace("'", "\\x27")
    lua = lua.replace("\n", "\\x0a")
    return f";return loadstring('{lua}')()"
    return lua


def unescape_lua(lua):
    if not lua.startswith(";return loadstring("):
        return lua

    lua = lua[20:-4]
    lua = lua.replace("\\x5c", "\\")
    lua = lua.replace("\\x22", '"')
    lua = lua.replace("\\x27", "'")
    lua = lua.replace("\\x0a", "\n")
    return lua


def parse_lua_record(record):
    type, _, content = record.partition(" ")
    unescaped_content = unescape_lua(content[1:-1])
    return type, unescaped_content


DnsRule = createType("DnsRule")


@registerQuery("dnsRules")
async def get_dns_rules(*_):
    return await dns_http().get_rules()


@DnsRule.field("name")
def resolve_name(rule, *_):
    return rule["name"]


@DnsRule.field("isLua")
def resolve_islua(rule, *_):
    return rule["type"] == "LUA"


@DnsRule.field("type")
def resolve_islua(rule, *_):
    if rule["type"] != "LUA":
        return rule["type"]
    type, _ = parse_lua_record(rule["records"][0]["content"])
    return type


@DnsRule.field("records")
def resolve_islua(rule, *_):
    if rule["type"] != "LUA":
        return rule["records"]

    records = []
    for record in rule["records"]:
        type, content = parse_lua_record(record["content"])
        records.append({**record, "content": content})
    return records


@DnsRule.field("nodeId")
def resolve_nodeid(rule, *_):
    return create_node_id("DNS_RULE", rule["zone"], rule["name"], rule["type"])


DnsRecord = createType("DnsRecord")


@DnsRecord.field("enabled")
def resolve_enabled(record, *_):
    return not record["disabled"]


@registerMutation("createDnsRule")
async def create_dns_rule_mutation(*_, input):
    records = input["records"]
    zone = input["zone"]
    name = input["name"]
    ttl = input["ttl"]
    type = input["type"]
    if len(records) < 1:
        raise PMException("At least one record required")

    if input["isLua"]:
        record = input["records"][0]
        escaped_content = escape_lua(record["content"])
        formated = f'{type} "{escaped_content}"'
        records = [{"content": formated, "enabled": record["enabled"]}]
        type = "LUA"

    try:
        await dns_http().create_rule(zone, name, type, ttl, records)
    except Exception as e:
        raise PMException(str(e))


@registerMutation("updateDnsRule")
async def update_dns_zone_mutation(*_, nodeId, patch):
    ttl = patch["ttl"]
    records = patch["records"]
    try:
        await dns_http().update_rule(nodeId, ttl, records)
    except Exception as e:
        raise PMException(str(e))


@registerMutation("deleteDnsRule")
async def delete_dns_rule_mutation(*_, nodeId):
    try:
        await dns_http().delete_rule(nodeId)
    except Exception as e:
        raise PMException(str(e))


@registerMutation("enableDnsRule")
async def enable_dns_rule_mutation(*_, nodeId, enabled):
    try:
        await dns_http().enable_rule(nodeId, enabled)
    except Exception as e:
        raise PMException(str(e))

@registerQuery("dnsRuleCheckPropagation")
async def resolve_rule_check(*_, nodeId):
    return await dns_http().check_rule(nodeId)