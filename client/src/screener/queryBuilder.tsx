import React from 'react';
import { Box, Flex, Button } from 'rebass';
// @ts-ignore
import { Label, Input, Select } from '@rebass/forms';
import { IoMdAdd } from 'react-icons/io';
import { Formik } from 'formik';
import { fields } from '../fields';
import { MapToList } from '../lib';
import { signs } from './signs';

const QueryBuilder = ({ onQueryChange }: any) => {

  return (
    <>

      <Formik
      initialValues={{ attr: 'MarketCap', val: 100, sign: '$gte' }}
      onSubmit={(values) => {
        const { attr, val, sign } = values;
        let multiplier = 1;
        if (fields[attr].multiplier) {
          multiplier = (fields[attr].multiplier as number);
        }
        onQueryChange({ [attr]: {[sign]: val * multiplier} });
      }}
    >
      {({ handleSubmit, handleChange, handleBlur, values }) => (

        <Box
          as='form'
          onSubmit={(e: any) => handleSubmit(e)}
          width={[1, 1, 1/2]}
          py={3}>

          <Flex mx={-2} mb={3} alignItems='flex-end'>

            <Box width={1.5/5} px={1}>
              <Label htmlFor='attr'>Attribute</Label>
              <Select
                id='attr'
                name='attr'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.attr}
              >
                {MapToList(fields).map((field: any) =>
                  <option value={field.id}>{field.title || field.id}</option>
                )}
              </Select>
            </Box>

            <Box width='60px' px={1}>
              <Select
                id='sign'
                name='sign'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.sign}
              >
                {MapToList(signs).map((sign: any) =>
                  <option value={sign.id}>{sign.title}</option>
                )}
              </Select>
            </Box>

            <Box width={1/5} px={1}>
              <Label htmlFor='val'>Value{values.attr === 'MarketCap' ? ' in M' : ''}</Label>
              <Input
                id='val'
                name='val'
                type='number'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.val}
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
