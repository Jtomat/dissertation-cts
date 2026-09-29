from core.ast_tree.ast_tree_factory import AstTreeFactory
from core.ast_tree.core.context import Context

context = Context()

declare_a = AstTreeFactory.build({ 'type': 'variable_declaration',
                       'name': 'a',
                       'value': { 'type': 'literal', 'value': 5 }
                       })

declare_b = AstTreeFactory.build({
    'type': 'variable_declaration',
    'name': 'b',
    'value': {
        "type": 'binary_math_operation',
        'operator': 'pow',
        'left': { 'type': 'reference', 'name': 'a' },
        'right': { 'type': 'literal', 'value': 2, }
    }
})

operation = AstTreeFactory.build({
    "type": 'binary_logical_operation',
    "operator": 'and',
    'left': { "type": 'literal', 'value': 1, },
    "right": { "type": 'reference', 'name': 'b', }
})

declare_a.eval(context)
declare_b.eval(context)
print(operation.eval(context))