
import { Tactic } from "../types/mitre";

export const mockTactics: Tactic[] = [
  {
    id: "TA0001",
    name: "Initial Access",
    description: "The adversary is trying to get into your network.",
    techniques: [
      {
        id: "T1189",
        name: "Drive-by Compromise",
        description: "Adversaries may gain access to a system through a user visiting a website over the normal course of browsing.",
        tacticId: "TA0001",
        subtechniques: []
      },
      {
        id: "T1190",
        name: "Exploit Public-Facing Application",
        description: "Adversaries may attempt to take advantage of a weakness in an Internet-facing computer or program using software, data, or commands.",
        tacticId: "TA0001",
        subtechniques: []
      },
      {
        id: "T1566",
        name: "Phishing",
        description: "Phishing is a technique used by adversaries to gain access by sending deceptive messages.",
        tacticId: "TA0001",
        subtechniques: [
          {
            id: "T1566.001",
            name: "Spearphishing Attachment",
            description: "Adversaries may send spearphishing emails with a malicious attachment in an attempt to gain access to victim systems.",
            parentTechniqueId: "T1566"
          },
          {
            id: "T1566.002",
            name: "Spearphishing Link",
            description: "Adversaries may send spearphishing emails with a malicious link in an attempt to gain access to victim systems.",
            parentTechniqueId: "T1566"
          }
        ]
      }
    ]
  },
  {
    id: "TA0002",
    name: "Execution",
    description: "The adversary is trying to run malicious code.",
    techniques: [
      {
        id: "T1059",
        name: "Command and Scripting Interpreter",
        description: "Adversaries may abuse command and script interpreters to execute commands, scripts, or binaries.",
        tacticId: "TA0002",
        subtechniques: [
          {
            id: "T1059.001",
            name: "PowerShell",
            description: "Adversaries may abuse PowerShell commands and scripts for execution.",
            parentTechniqueId: "T1059"
          },
          {
            id: "T1059.003",
            name: "Windows Command Shell",
            description: "Adversaries may abuse the Windows command shell for execution.",
            parentTechniqueId: "T1059"
          }
        ]
      },
      {
        id: "T1203",
        name: "Exploitation for Client Execution",
        description: "Adversaries may exploit software vulnerabilities in client applications to execute code.",
        tacticId: "TA0002",
        subtechniques: []
      }
    ]
  },
  {
    id: "TA0003",
    name: "Persistence",
    description: "The adversary is trying to maintain their foothold.",
    techniques: [
      {
        id: "T1547",
        name: "Boot or Logon Autostart Execution",
        description: "Adversaries may configure system settings to automatically execute a program during system boot or logon.",
        tacticId: "TA0003",
        subtechniques: [
          {
            id: "T1547.001",
            name: "Registry Run Keys / Startup Folder",
            description: "Adversaries may achieve persistence by adding a program to a startup folder or referencing it with a Registry run key.",
            parentTechniqueId: "T1547"
          },
          {
            id: "T1547.004",
            name: "Winlogon Helper DLL",
            description: "Adversaries may abuse Winlogon to execute malicious DLLs and/or executables.",
            parentTechniqueId: "T1547"
          }
        ]
      },
      {
        id: "T1554",
        name: "Compromise Client Software Binary",
        description: "Adversaries may modify client software binaries to establish persistence.",
        tacticId: "TA0003",
        subtechniques: []
      }
    ]
  },
  {
    id: "TA0004",
    name: "Privilege Escalation",
    description: "The adversary is trying to gain higher-level permissions.",
    techniques: [
      {
        id: "T1548",
        name: "Abuse Elevation Control Mechanism",
        description: "Adversaries may abuse elevation control mechanisms to gain higher-level permissions.",
        tacticId: "TA0004",
        subtechniques: [
          {
            id: "T1548.001",
            name: "Setuid and Setgid",
            description: "Adversaries may perform privilege escalation using setuid and setgid binaries.",
            parentTechniqueId: "T1548"
          },
          {
            id: "T1548.002",
            name: "Bypass User Account Control",
            description: "Adversaries may bypass UAC mechanisms to elevate process privileges.",
            parentTechniqueId: "T1548"
          }
        ]
      },
      {
        id: "T1134",
        name: "Access Token Manipulation",
        description: "Adversaries may modify access tokens to operate under a different user or system security context.",
        tacticId: "TA0004",
        subtechniques: [
          {
            id: "T1134.001",
            name: "Token Impersonation/Theft",
            description: "Adversaries may create a new access token to impersonate another user or system account.",
            parentTechniqueId: "T1134"
          }
        ]
      }
    ]
  },
  {
    id: "TA0005",
    name: "Defense Evasion",
    description: "The adversary is trying to avoid being detected.",
    techniques: [
      {
        id: "T1070",
        name: "Indicator Removal on Host",
        description: "Adversaries may delete or modify artifacts generated on a host system to hide their presence.",
        tacticId: "TA0005",
        subtechniques: [
          {
            id: "T1070.001",
            name: "Clear Windows Event Logs",
            description: "Adversaries may clear Windows Event Logs to hide their tracks.",
            parentTechniqueId: "T1070"
          },
          {
            id: "T1070.003",
            name: "Clear Command History",
            description: "Adversaries may clear command history to conceal the commands they ran.",
            parentTechniqueId: "T1070"
          }
        ]
      },
      {
        id: "T1027",
        name: "Obfuscated Files or Information",
        description: "Adversaries may attempt to make an executable or file difficult to discover or analyze.",
        tacticId: "TA0005",
        subtechniques: [
          {
            id: "T1027.001",
            name: "Binary Padding",
            description: "Adversaries may use binary padding to add junk data and change the on-disk representation of malware.",
            parentTechniqueId: "T1027"
          }
        ]
      }
    ]
  },
  {
    id: "TA0006",
    name: "Credential Access",
    description: "The adversary is trying to steal account names and passwords.",
    techniques: [
      {
        id: "T1110",
        name: "Brute Force",
        description: "Adversaries may use brute force techniques to gain access to accounts.",
        tacticId: "TA0006",
        subtechniques: [
          {
            id: "T1110.001",
            name: "Password Guessing",
            description: "Adversaries may use password guessing to access accounts.",
            parentTechniqueId: "T1110"
          },
          {
            id: "T1110.002",
            name: "Password Cracking",
            description: "Adversaries may use password cracking techniques to access accounts.",
            parentTechniqueId: "T1110"
          }
        ]
      },
      {
        id: "T1555",
        name: "Credentials from Password Stores",
        description: "Adversaries may search for common password storage locations to obtain credentials.",
        tacticId: "TA0006",
        subtechniques: [
          {
            id: "T1555.001",
            name: "Keychain",
            description: "Adversaries may collect passwords from Keychain.",
            parentTechniqueId: "T1555"
          }
        ]
      }
    ]
  }
];
