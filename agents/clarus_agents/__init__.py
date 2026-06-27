"""Clarus coded agents — the AI workforce orchestrated by UiPath Maestro.

Three agents, each a single-responsibility step in the Invoice-to-Pay process:

- extraction_agent  : raw invoice document  -> structured invoice
- match_agent       : invoice + PO + receipt -> 3-way match result (deterministic)
- triage_agent      : a match exception      -> classification + recommendation

All three are plain Python functions so they can be called from a UiPath
coded workflow, an API Workflow HTTP request, or the bundled FastAPI server.
"""

from .extraction_agent import extract_invoice
from .match_agent import three_way_match
from .triage_agent import triage_exception

__all__ = ["extract_invoice", "three_way_match", "triage_exception"]
