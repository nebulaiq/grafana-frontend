package setting

import "strings"

type NebulaIQSettings struct {
	EnabledPages   []string // comma-separated page IDs from config; nil = all enabled
	EnabledActions []string // comma-separated action names from config; nil = all enabled
}

// parseCommaSeparated splits a comma-separated string into trimmed, non-empty parts.
func parseCommaSeparated(raw string) []string {
	if raw == "" {
		return nil
	}
	var result []string
	for _, p := range strings.Split(raw, ",") {
		trimmed := strings.TrimSpace(p)
		if trimmed != "" {
			result = append(result, trimmed)
		}
	}
	return result
}

func (cfg *Cfg) readNebulaIQSettings() {
	nebulaiqSection := cfg.Raw.Section("nebulaiq")
	cfg.NebulaIQ.EnabledPages = parseCommaSeparated(nebulaiqSection.Key("enabled_pages").MustString(""))
	cfg.NebulaIQ.EnabledActions = parseCommaSeparated(nebulaiqSection.Key("enabled_actions").MustString(""))
}
