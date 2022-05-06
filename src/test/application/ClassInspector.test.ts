import { suite, test } from 'mocha';
import ClassInspector from '../../application/ClassInspector';
import VsCode from '../../domain/VsCode';
import * as assert from 'assert';
import { mock, when, verify, instance } from 'ts-mockito';
import PositionOffset from '../../domain/PositionOffset';
import RegexpHelper from '../../application/RegexpHelper';

const exampleText: string = `<?php
class Example
{
    /** 
     * @var DateTime */
    private $dateTimeVar1;
    
    /** 
     * @var DateTime */
    private $dateTimeVar2;
    
    /** 
     * @var DateTime 
     */
    private $dateTimeVar3;

    /** 
     * @var DateTime
     * @Type("enum")
     */
    private $dateTimeVar4;

    /** @var string */
    private $property1;

    /** @var Gamboa\DataType */
    private $propertyDateTimeWithNamesPace;

    private $property2;

    private $property_3;

    private $property;

    private $PROPERTY;

    protected $protectedProperty;

    public $publicProperty;

    /**
     * @Assert\NotBlank(message="test string")
     *
     * @Assert\GreaterThan(value=0, message = "test string")
     *
     * @Assert\Type(type="integer", message="test string")
     *
     * @var int
     */
    public $test;

    /**
     * @var int[]
     */
    public $test2;

    /**
     * @var int[]|null
     */
    public $test3;

    /**
     * @var array<int, int>
     */
    public $test4;

    /**
     * @var mixed[]
     */
    public $test5;

    /**
     * @var array<int>
     */
    public $test6;

}`;

suite('ClassInspector Suite', () => {

    test('properties should have private, protected or public modifier', () => {

        const vscodeMock: VsCode = mock<VsCode>();
        when(vscodeMock.getText()).thenReturn(exampleText);
        let vscode: VsCode = instance(vscodeMock);

        const helper = new RegexpHelper();
        const inspector = new ClassInspector(vscode, helper);
        const properties = inspector.getProperties();

        verify(vscodeMock.getText()).called();
        assert.strictEqual(properties.size, 18);
        assert.strictEqual(properties.has('dateTimeVar1'), true);
        assert.strictEqual(properties.has('dateTimeVar2'), true);
        assert.strictEqual(properties.has('dateTimeVar3'), true);
        assert.strictEqual(properties.has('dateTimeVar4'), true);
        assert.strictEqual(properties.has('property1'), true);
        assert.strictEqual(properties.has('property2'), true);
        assert.strictEqual(properties.has('property_3'), true);
        assert.strictEqual(properties.has('PROPERTY'), true);
        assert.strictEqual(properties.has('property'), true);
        assert.strictEqual(properties.has('protectedProperty'), true);
        assert.strictEqual(properties.has('publicProperty'), true);
        assert.strictEqual(properties.has('test'), true);
        assert.strictEqual(properties.has('test2'), true);
        assert.strictEqual(properties.has('test3'), true);
        assert.strictEqual(properties.has('test4'), true);
        assert.strictEqual(properties.has('test5'), true);
        assert.strictEqual(properties.has('test6'), true);

    });

    test('var type should be assigned when exists', () => {
        const vscodeMock: VsCode = mock<VsCode>();
        when(vscodeMock.getText()).thenReturn(exampleText);
        let vscode: VsCode = instance(vscodeMock);

        const helper = new RegexpHelper();
        const inspector = new ClassInspector(vscode, helper);
        const properties = inspector.getProperties();

        verify(vscodeMock.getText()).called();
        assert.strictEqual(properties.get('dateTimeVar1')?.type, "DateTime");
        assert.strictEqual(properties.get('dateTimeVar2')?.type, "DateTime");
        assert.strictEqual(properties.get('dateTimeVar3')?.type, "DateTime");
        assert.strictEqual(properties.get('dateTimeVar4')?.type, "DateTime");
        assert.strictEqual(properties.get('property1')?.type, "string");
        assert.strictEqual(properties.get('property')?.type, "mixed");
        assert.strictEqual(properties.get('propertyDateTimeWithNamesPace')?.type, `Gamboa\DataType`);
        assert.strictEqual(properties.get('test')?.type, `int`);
        assert.strictEqual(properties.get('test2')?.type, `int[]`);
        assert.strictEqual(properties.get('test3')?.type, `int[]|null`);
        assert.strictEqual(properties.get('test4')?.type, `array<int, int>`);
        assert.strictEqual(properties.get('test5')?.type, `mixed[]`);
        assert.strictEqual(properties.get('test6')?.type, `array<int>`);
    });

    test('constructor offset should be after last property', () => {
        const vscodeMock: VsCode = mock<VsCode>();
        when(vscodeMock.getText()).thenReturn(exampleText);
        let vscode: VsCode = instance(vscodeMock);

        const helper = new RegexpHelper();
        const inspector = new ClassInspector(vscode, helper);
        const offset: PositionOffset = inspector.getOffsetForConstructor();

        verify(vscodeMock.getText()).called();
        assert.strictEqual(offset.value, 1119);
    });

    test('getter offset should be before last closing curly brace', () => {
        const vscodeMock: VsCode = mock<VsCode>();
        when(vscodeMock.getText()).thenReturn(exampleText);
        let vscode: VsCode = instance(vscodeMock);

        const helper = new RegexpHelper();
        const inspector = new ClassInspector(vscode, helper);
        const offset: PositionOffset = inspector.getOffsetForGetter();

        verify(vscodeMock.getText()).called();
        assert.strictEqual(offset.value, 1121);
    });
});