import React from 'react';
import { Box, Flex, Button, Text } from 'rebass';
// @ts-ignore
import { Label, Input, Select } from '@rebass/forms';
import { IoMdAdd } from 'react-icons/io';
import { Formik } from 'formik';
import { fields } from '../fields';
import { MapToList } from '../lib';


const QueryBuilder = ({ onQueryChange }: any) => {

  return (
    <>
      <Text variant='caps1'>Query Builder</Text>

      <Formik
      initialValues={{ attr: 'MarketCap', val: 100 }}
      onSubmit={(values) => {
        const { attr, val } = values;
        onQueryChange({ [attr]: {$gte: val * 1000000} });
      }}
    >
      {props => (

        <Box
          as='form'
          onSubmit={(e: any) => props.handleSubmit(e)}
          width={[1, 1, 1/2]}
          py={3}>

          <Flex mx={-2} mb={3} alignItems='flex-end'>

            <Box width={3/5} px={1}>
              <Label htmlFor='attr'>Attribute</Label>
              <Select
                id='attr'
                name='attr'
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.attr}
              >
                {MapToList(fields).map((field: any) =>
                  <option value={field.id}>{field.title || field.id}</option>
                )}
              </Select>
            </Box>

            <Box width={1/5} px={1}>
              <Label htmlFor='val'>Value</Label>
              <Input
                id='val'
                name='val'
                type='number'
                onChange={props.handleChange}
                onBlur={props.handleBlur}
                value={props.values.val}
              />
            </Box>

            <Box px={2}>
              <Button m={0}>
                <IoMdAdd />
                <span> criteria</span>
              </Button>
            </Box>

          </Flex>
        </Box>
      )}
      </Formik>
    </>
  );
}

export default QueryBuilder;
