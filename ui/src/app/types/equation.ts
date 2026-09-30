export interface Node {
    type: string;
}

export interface Declaration extends Node {
    name: string;
    value: Expression;
}

export interface FunctionDeclaration extends Declaration {
    type: 'function_declaration';
    arguments: Array<string>;
}

export interface VariableDeclaration extends Declaration {
    type: 'variable_declaration'
}

export interface Expression extends Node {

}

// export interface ExNode {
//     id: string
//     name: string
//     description: string
//     declaration: Declaration
// }

export interface FunctionCall extends Expression {
    type: 'function_call';
    name: string;
    arguments: Record<string, Expression>
}

export interface Operation {
    operator: string;
}

export interface BinaryOperation extends Operation {
    left: Expression;
    right: Expression;
}

export interface UnaryOperation extends Operation {
    operand: Expression
}

export interface ConditionVariant extends Expression {
    condition: Expression
    then_: Expression
}

export interface Condition extends Expression {
    variants: Array<ConditionVariant>
    else: Expression
}